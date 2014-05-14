# -*- encoding : utf-8 -*-
module Geo::PathSurfaceHelper
  def pathtype_collection; h = {} ; Geo::PathType.asc(:order_by).each{|x| h[x.name] = x.id }; h end

  def pathsurface_form(surface,opts={})
    title=surface.new_record? ? 'ახალი საფარი' : 'საფარის შეცვლა'
    icon='/icons/road.png'
    cancel_url=surface.new_record? ? geo_path_surfaces_url : geo_path_surface_url(id: surface.id)
    forma_for surface, title: title, collapsible: true, icon: icon do |f|
      f.combo_field 'type_id', collection: pathtype_collection, empty: false, required: true, i18n: 'type', readonly: (not surface.new_record?)
      f.text_field 'name', required: true, autofocus: true
      f.submit 'შენახვა'
      f.cancel_button cancel_url
    end
  end

  def pathsurface_view(surface)
    view_for surface, title: 'სახეობის თვისება', icon: '/icons/car.png', collapsible: true do |f|
      f.edit_action geo_edit_path_surface_url(id:surface.id)
      f.delete_action geo_delete_path_surface_url(id:surface.id)
      f.tab title: 'ძირითადი', icon: '/icons/car.png' do |f|
        f.complex_field required: true, i18n: 'order_by' do |c|
          c.text_field 'type.name', after: '&mdash;'.html_safe, url: geo_path_type_url(id:surface.type_id)
          c.text_field 'order_by', tag: 'strong'
        end
        f.text_field 'name', required: true
      end
      f.tab title: 'სისტემური', icon: '/icons/traffic-cone.png' do |f|
        f.timestamps
        f.userstamps
      end
    end
  end
end
