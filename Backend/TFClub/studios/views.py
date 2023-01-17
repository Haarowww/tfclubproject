
from django.shortcuts import render, redirect
from rest_framework.generics import CreateAPIView, RetrieveUpdateAPIView, DestroyAPIView, RetrieveAPIView, ListAPIView

from classes.models import Classes
from rest_framework.parsers import MultiPartParser, FormParser
from studios.serializers import StudioSerializer, DeleteStudioSerializer, UserNearestStudio, PickStudio, FilterStudio
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from math import *
from studios.models import Studio, Amenities
import ast
from django.db.models import Case, When
from rest_framework.filters import SearchFilter, OrderingFilter


# Create your views here.
class CreateStudioView(CreateAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = StudioSerializer
    parser_classes = [MultiPartParser, FormParser]


class EditStudioView(RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = StudioSerializer
    queryset = Studio.objects.all()


class DeleteStudioView(DestroyAPIView):
    permission_classes = [IsAuthenticated, ]
    serializer_class = DeleteStudioSerializer
    queryset = Studio.objects.all()


class ShowStudio(ListAPIView):
    serializer_class = PickStudio

    def get(self, request):
        data_dict = {}
        for studio in Studio.objects.all():
            all_amenities = Amenities.objects.filter(studio=studio.id).all()
            amenities_list = []
            for item in all_amenities:
                temp = {'type': item.type,
                        'quantity': item.quantity}
                amenities_list.append(temp)
            if studio.images:
                data = {'name': studio.name,
                        'address': studio.address,
                        'latitude': studio.latitude,
                        'longitude': studio.longitude,
                        'postal_code': studio.postal_code,
                        'phone_number': studio.phone_number,
                        'amenities': amenities_list,
                        'images': studio.images.url,
                        'type': studio.type,
                        'quantity': studio.quantity,
                        'id': studio.id
                        }
            else:
                data = {'name': studio.name,
                        'address': studio.address,
                        'latitude': studio.latitude,
                        'longitude': studio.longitude,
                        'postal_code': studio.postal_code,
                        'phone_number': studio.phone_number,
                        'amenities': amenities_list,
                        'images': "",
                        'type': studio.type,
                        'quantity': studio.quantity,
                        'id': studio.id
                        }
            data_dict[studio.id] = data

        return Response(data_dict)


class NearestStudioView(CreateAPIView):
    serializer_class = UserNearestStudio
    queryset = Studio.objects.all()

    def post(self, request, *args, **kwargs):
        user = self.get_serializer(data=request.data)
        user.is_valid(raise_exception=True)
        studios = Studio.objects.all()
        s = []
        for studio in studios:
            acc_lo = studio.longitude
            acc_la = studio.latitude
            distance = 2 * abs(asin(abs(sqrt(abs(sin((user.data["latitude"] - acc_la) / 2) ** 2
                                             + cos(user.data["latitude"]) * cos(acc_la)
                                             * sin((user.data["longitude"] - acc_lo) / 2) ** 2))))) * 6378.137
            s.append((studio.id, distance))
        def by_distance(a):
            return a[1]
        result = sorted(s, key=by_distance)
        result_id = []
        for i in result:
            result_id.append(i[0])
        # return Response(result_id)
        return redirect("distance_show", data=result_id)
        # return Response(result)


class DistanceShowView(ListAPIView):
    serializer_class = StudioSerializer

    def get_queryset(self):
        query = ast.literal_eval(self.kwargs["data"])
        ids = [int(sid) for sid in query]
        order = Case(*[When(id=id, then=pos) for pos, id in enumerate(ids)])
        all_objects = Studio.objects.all()
        return all_objects.filter(id__in=ids).order_by(order)


class PickStudioView(RetrieveAPIView):
    serializer_class = PickStudio

    def get(self, request, pk):
        if not Studio.objects.filter(id=pk).exists():
            return Response('Studio not exist', status=404)
        else:
            studio = Studio.objects.get(id=pk)
            all_amenities = Amenities.objects.filter(studio=studio.id).all()
            amenities_list = []
            for item in all_amenities:
                temp = {'type': item.type,
                        'quantity': item.quantity}
                amenities_list.append(temp)
            if studio.images:
                data = {'name': studio.name,
                        'address': studio.address,
                        'latitude': studio.latitude,
                        'longitude': studio.longitude,
                        'postal_code': studio.postal_code,
                        'phone_number': studio.phone_number,
                        'amenities': amenities_list,
                        'images': studio.images.url,
                        'type': studio.type,
                        'quantity': studio.quantity
                        }
            else:
                data = {'name': studio.name,
                        'address': studio.address,
                        'latitude': studio.latitude,
                        'longitude': studio.longitude,
                        'postal_code': studio.postal_code,
                        'phone_number': studio.phone_number,
                        'amenities': amenities_list,
                        'images': "",
                        'type': studio.type,
                        'quantity': studio.quantity
                        }

            return Response(data)




class FilterStudioView(CreateAPIView):
    serializer_class = FilterStudio
    queryset = Studio.objects.all()

    def post(self, request, *args, **kwargs):
        user = self.get_serializer(data=request.data)
        user.is_valid(raise_exception=True)
        acc, acc1, acc2, acc3, acc4 = set(), set(), set(), set(), set()
        studios = Studio.objects.all()
        for studio in studios:
            acc_name = studio.name
            if "name" in user.data and user.data["name"] != "":
                if user.data["name"] == acc_name:
                    acc.add(studio.id)
            amenities = Amenities.objects.filter(studio_id=studio.id).all()
            for amenity in amenities:
                if "type" in user.data and user.data["type"] != "":
                    if user.data["type"] == amenity.type and user.data["type"] is not None:
                        acc1.add(amenity.studio_id)
                if "quantity" in user.data and user.data["quantity"] != 0:
                    if user.data["quantity"] == amenity.quantity and user.data["quantity"] is not None:
                        acc2.add(amenity.studio_id)
            classes = Classes.objects.filter(studio_id=studio.id).all()
            for class_model in classes:
                if "coach_name" in user.data and user.data["coach_name"] != "":
                    if user.data["coach_name"] == class_model.coach and user.data["coach_name"] is not None:
                        acc3.add(class_model.studio_id)
                if "class_name" in user.data and user.data["class_name"] != "":
                    if user.data["class_name"] == class_model.name and user.data["class_name"] is not None:
                        acc4.add(class_model.studio_id)
        # return Response(acc3)
        result = acc.union(acc1).union(acc2).union(acc3).union(acc4)

        return redirect("filter_show_studio", data=result)


class FilterShowView(ListAPIView):
    serializer_class = StudioSerializer

    def get_queryset(self):
        query = ast.literal_eval(self.kwargs["data"])
        ids = [int(sid) for sid in query]
        all_objects = Studio.objects.all()
        return all_objects.filter(id__in=ids)


class SearchShowView(ListAPIView):
    serializer_class = StudioSerializer
    queryset = Studio.objects.all()
    filter_backends = (SearchFilter, OrderingFilter)
    search_fields = ('^address', '=longitude', '=latitude', '^postal_code',
                     '=phone_number', '=type', '^name')