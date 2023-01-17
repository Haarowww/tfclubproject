from django.contrib import admin

from classes.models import Classes, ClassesInstance
# Register your models here.
class ClassesInstanceAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "description", "coach", "keywords", "capacity",
                    "curr_enrollment", "start_time", "end_time", "status")

class ClassesAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "description", "coach", "keywords", "capacity", "start_time",
                    "end_time", "status", "end_recur_date_time", "studio")

admin.site.register(Classes, ClassesAdmin)
admin.site.register(ClassesInstance, ClassesInstanceAdmin)
