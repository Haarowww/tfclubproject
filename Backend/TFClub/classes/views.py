import datetime
from ast import literal_eval
from django.utils import timezone
from rest_framework.filters import SearchFilter, OrderingFilter
from django.shortcuts import redirect
from rest_framework.generics import CreateAPIView, get_object_or_404, ListAPIView, \
    RetrieveUpdateAPIView, \
    DestroyAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.exceptions import ValidationError

from studios.models import Studio
from classes.models import Classes, ClassesInstance
from classes.serializers import ClassSerializer, DeleteClassesSerializer, StudioClassSerializer, \
    SignUpClassSerializer, FilterClassSerializer, ClassInstanceSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


# Create your views here.
class StandardResultSetPagination(PageNumberPagination):
    page_size = 1000000000000000000000
    page_size_query_param = "page_size"
    max_page_size = 1000000000000000000000


class CreateClassesView(CreateAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = ClassSerializer


class EditClassesView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = ClassSerializer
    queryset = Classes.objects.all()


class DeleteClassesView(DestroyAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = DeleteClassesSerializer
    queryset = Classes.objects.all()


class ListClassesView(CreateAPIView):
    serializer_class = StudioClassSerializer
    model = ClassesInstance
    queryset = ClassesInstance.objects.all()

    def get(self, request, *args, **kwargs):
        """return a list of studio id to there names to assist filtering"""
        res = {st.id: st.name for st in Studio.objects.all()}
        return Response(res)

    def post(self, request, *args, **kwargs):
        """return all classes happen in the selected studio"""
        user = self.get_serializer(data=request.data)
        user.is_valid(raise_exception=True)
        qualifying_cl = self.get_queryset().filter \
            (h_class__studio__id=user.data["studio"], status=True,
             start_time__gte=timezone.now()).order_by("start_time")
        q_cls = [cl.id for cl in qualifying_cl]
        return redirect('list_show', data=q_cls)


class ListClassesShowView(ListAPIView):
    serializer_class = ClassInstanceSerializer
    model = ClassesInstance
    pagination_class = StandardResultSetPagination

    def get_queryset(self):
        q_cl = literal_eval(self.kwargs["data"])
        q_cls = [int(ele) for ele in q_cl]
        all_objects = ClassesInstance.objects.all()
        return all_objects.filter(id__in=q_cls).order_by("start_time")


class SignUpClassView(CreateAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = SignUpClassSerializer
    model = ClassesInstance
    queryset = ClassesInstance.objects.all()

    def post(self, request, *args, **kwargs):
        """For logged_in users, sign up classes for them if the following conditions all apply:
        1. classes has neither been cancelled or passed
        2. classes has capacity for one more assignment
        3. user has an active subscription
        User has the following options:
        1. uncheck 'future': sign up for single class indicated by class id
        2. check 'future': sign up for all future occurrence indicated by class id"""
        user = self.get_serializer(data=request.data)
        user.is_valid(raise_exception=True)
        sign_up_cl = get_object_or_404(queryset=self.get_queryset(), id=user.data["class_id"])
        customer = request.user
        if sign_up_cl.start_time < timezone.now():
            raise ValidationError("You cannot signup for a passed class")
        elif sign_up_cl.capacity <= sign_up_cl.curr_enrollment:
            raise ValidationError("Course Full!")
        elif not sign_up_cl.status:
            raise ValidationError("Course Cancelled")
        elif customer.expiry_date is None or customer.expiry_date < sign_up_cl.start_time:
            raise ValidationError("You are not activated")
        else:
            if user.data["future"]:
                # Find Future occurrence of this class
                candidates = []
                for cl in self.get_queryset():
                    if cl.h_class.id == sign_up_cl.h_class.id and cl.start_time >= sign_up_cl.start_time:
                        candidates.append(cl)
                # at least one occurrence -- sign_up_cl
                for q_cl in candidates:
                    if q_cl.start_time < timezone.now():
                        continue
                    elif q_cl.capacity <= q_cl.curr_enrollment:
                        continue
                    elif not q_cl.status:
                        continue
                    elif customer.expiry_date is None or customer.expiry_date < q_cl.start_time:
                        continue
                    else:
                        customer.classes.add(q_cl)
                        q_cl.curr_enrollment += 1
                        q_cl.save()

                customer.save()
                return redirect('list_customer_class')
            else:
                customer.classes.add(sign_up_cl)
                customer.save()
                sign_up_cl.curr_enrollment += 1
                sign_up_cl.save()
                return redirect('list_customer_class')


class DropClassView(CreateAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = SignUpClassSerializer
    model = ClassesInstance
    queryset = ClassesInstance.objects.all()

    def post(self, request, *args, **kwargs):
        user = self.get_serializer(data=request.data)
        user.is_valid(raise_exception=True)
        drop_cl = get_object_or_404(queryset=self.get_queryset(), id=user.data["class_id"])
        customer = request.user
        if drop_cl.start_time < timezone.now():
            raise ValidationError("You cannot drop a passed class")
        elif not drop_cl.status:
            raise ValidationError("Course Cancelled")
        elif not customer.classes.filter(id=drop_cl.id).exists():
            raise ValidationError("You have not sign_up for this course")
        else:
            if user.data["future"]:
                if user.data["future"]:
                    # Find Future occurrence of this class
                    candidates = []
                    for cl in self.get_queryset():
                        if cl.h_class.id == drop_cl.h_class.id and cl.start_time >= drop_cl.start_time:
                            candidates.append(cl)
                    # at least one occurrence -- sign_up_cl
                    for q_cl in candidates:
                        if q_cl.start_time < timezone.now():
                            continue
                        elif not q_cl.status:
                            continue
                        elif not customer.classes.filter(id=q_cl.id).exists():
                            continue
                        customer.classes.remove(q_cl)
                        q_cl.curr_enrollment -= 1
                        q_cl.save()

                    customer.save()
                    return redirect('list_customer_class')
            else:
                customer.classes.remove(drop_cl)
                customer.save()
                drop_cl.curr_enrollment -= 1
                drop_cl.save()
                return redirect('list_customer_class')


class ListCustomerClassView(ListAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = ClassInstanceSerializer
    pagination_class = StandardResultSetPagination

    # paginate_by = 1

    def get_queryset(self):
        customer = self.request.user
        query_set = ClassesInstance.objects.all()

        for cl in query_set:
            if not customer.classes.filter(id=cl.id).exists():
                query_set = query_set.exclude(id=cl.id)

        return query_set.order_by("start_time")


class FilterClassesView(CreateAPIView):
    serializer_class = FilterClassSerializer
    queryset = ClassesInstance.objects.all()

    def get(self, request, *args, **kwargs):
        """Returns related information for related subjects that could be used for filtering"""
        studios = {}
        name = []
        coach = []
        for st in Studio.objects.all():
            studios[st.id] = st.name
        for cl in self.get_queryset():
            if cl.name not in name and not (cl.name is None):
                name.append(cl.name)
            if cl.coach not in coach and not (cl.coach is None):
                coach.append(cl.coach)
        return Response({"studios": studios, "name": name, "coach": coach})

    def check_date(self, res_set, user):
        res = []
        list_criteria = [0, 0]
        if "start_date" in user.data and not (user.data["start_date"] is None):
            list_criteria[0] = 1
        if "end_date" in user.data and not (user.data["end_date"] is None):
            list_criteria[1] = 1

        # start and end both None
        if sum(list_criteria) == 0:
            return [cl.id for cl in res_set]
        # start and end both not None
        elif sum(list_criteria) == 2:
            for cl in res_set:
                if cl.start_time.date() >= datetime.datetime.strptime(user.data["start_date"],
                                                                      "%Y-%m-%d").date() and \
                        cl.end_time.date() <= datetime.datetime.strptime(user.data["end_date"],
                                                                         "%Y-%m-%d").date():
                    res.append(cl.id)
            return res
        else:
            # start is not None
            if list_criteria[0] == 1:
                for cl in res_set:
                    if cl.start_time.date() >= datetime.datetime.strptime(user.data["start_date"],
                                                                          "%Y-%m-%d").date():
                        res.append(cl.id)
                return res

            if list_criteria[1] == 1:
                for cl in res_set:
                    if cl.end_time.date() <= datetime.datetime.strptime(user.data["end_date"],
                                                                        "%Y-%m-%d").date():
                        res.append(cl.id)
                return res

    def check_time(self, res_set, user):
        res = []
        list_criteria = [0, 0]
        if "starts" in user.data and not (user.data["starts"] is None):
            list_criteria[0] = 1
        if "ends" in user.data and not (user.data["ends"] is None):
            list_criteria[1] = 1

        # start and end both None
        if sum(list_criteria) == 0:
            return [cl.id for cl in res_set]
        # start and end both not None
        elif sum(list_criteria) == 2:
            for cl in res_set:
                if cl.start_time.time() > datetime.datetime.strptime(user.data["starts"],
                                                                     "%H:%M:%S").time() and \
                        cl.end_time.time() < datetime.datetime.strptime(user.data["ends"],
                                                                        "%H:%M:%S").time():
                    res.append(cl.id)
            return res
        else:
            # start is not None
            if list_criteria[0] == 1:
                for cl in res_set:
                    if cl.start_time.time() > datetime.datetime.strptime(user.data["starts"],
                                                                         "%H:%M:%S").time():
                        res.append(cl.id)
                return res

            if list_criteria[1] == 1:
                for cl in res_set:
                    if cl.end_time.time() < datetime.datetime.strptime(user.data["ends"],
                                                                       "%H:%M:%S").time():
                        res.append(cl.id)
                return res

    def post(self, request, *args, **kwargs):
        """Send filtered data to List View, filter rules are as followed:
        1. If a subject is empty, then do not filter on that subject
        2. For date filtering, if start is missing, then only return qualifying objects before
            end date, so is in condition that end is missing
        3. For time range filtering, it filters a specific time range DAILY. For instance,
            starts=6:00PM, ends=8:00PM returns all classes that starts before 6:00PM and ends before
            8:00OM, no matter what date it is(constraint by date filtering if applicable)"""
        user = self.get_serializer(data=request.data)
        user.is_valid(raise_exception=True)

        res_set = self.get_queryset().filter(h_class__studio__id=user.data["studio_id"])
        # First Filter By name
        if "name" in user.data and not (user.data["name"] is None) and user.data["name"] != "":
            filter_name = user.data["name"]
            res_set = res_set.filter(name=filter_name)

        if "coach" in user.data and not (user.data["coach"] is None) and user.data["coach"] != "":
            filter_coach = user.data["coach"]
            res_set = res_set.filter(coach=filter_coach)

        res_time = self.check_time(res_set, user)
        res_date = self.check_date(res_set, user)

        res = list(set(res_time) & set(res_date))

        return redirect("filter_show", data=res)


class FilterShowView(ListAPIView):
    serializer_class = ClassInstanceSerializer
    pagination_class = StandardResultSetPagination

    # def get(self, request, *args, **kwargs):
    #     return Response(self.kwargs["data"])

    def get_queryset(self):
        q_cls = literal_eval(self.kwargs["data"])
        all_objects = ClassesInstance.objects.all()

        return all_objects.filter(id__in=q_cls)


class SearchClassShowView(ListAPIView):
    pagination_class = StandardResultSetPagination
    serializer_class = ClassInstanceSerializer
    queryset = ClassesInstance.objects.all()
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = ("=name", "=coach", "=start_time", "=end_time", "=capacity", "=keywords")
