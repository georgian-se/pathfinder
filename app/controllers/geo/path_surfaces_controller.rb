# -*- encoding : utf-8 -*-
class Geo::PathSurfacesController < ApplicationController
  def index
    @title='გზის საფარი'
    @surfaces=Geo::PathSurface.asc(:type_id, :order_by)
  end

  def new
    @title='გზის ახალი საფარი'
    if request.post?
      @surface=Geo::PathSurface.new(surface_params)
      if @surface.save(user:current_user)
        Geo::PathSurface.numerate(@surface.type)
        redirect_to geo_path_surface_url(id: @surface.id), notice: 'საფარი დამატებულია'
      end
    else
      @surface=Geo::PathSurface.new
    end
  end

  def edit
    # @title='გზის სახეობის რედაქტირება'
    # @type=Geo::PathType.find(params[:id])
    # if request.post?
    #   @type.update_attributes(type_params.merge(user:current_user))
    #   redirect_to geo_path_type_url(id:@type.id), notice: 'სახეობა შეცვლილია'
    #   Geo::PathType.numerate
    # end
  end

  def show
    # @title='გზის სახეობის თვისებები'
    # @type=Geo::PathType.find(params[:id])
  end

  def delete
    # type=Geo::PathType.find(params[:id])
    # type.destroy
    # Geo::PathType.numerate
    # redirect_to geo_path_types_url, notice: 'გზის სახეობა წაშლილია'
  end

  def up
    # type=Geo::PathType.find(params[:id])
    # type.up
    # redirect_to geo_path_types_url, notice: 'ნუმერაცია შეცვლილია'
  end

  def down
    # type=Geo::PathType.find(params[:id])
    # type.down
    # redirect_to geo_path_types_url, notice: 'ნუმერაცია შეცვლილია'
  end

  protected
  def nav
    @nav=super
    @nav['გზის საფარი']=geo_path_surfaces_url
    # if @type
    #   if 'edit'==action_name
    #     @nav[@type.name]=geo_path_type_url(id:@type.id)
    #   end
    #   @nav[@title]=nil
    # end
  end

  private
  def surface_params; params.require(:geo_path_surface).permit(:name, :type_id) end
end
