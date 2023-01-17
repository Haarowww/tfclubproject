from django.contrib import admin
from studios.models import Studio, Amenities

class StudioAdmin(admin.ModelAdmin):
    list_display = ("id", "name")


# Register your models here.
admin.site.register(Studio, StudioAdmin)
admin.site.register(Amenities)
