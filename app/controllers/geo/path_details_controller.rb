# -*- encoding : utf-8 -*-
class Geo::PathDetailsController < ApplicationController
  def index
    @title='გზის დეტალები'
    @details=Geo::PathDetail.asc(:surface_id, :order_by)
  end

  def new
    @title='გზის ახალი დეტალი'
    if request.post?
      detail_params=params.require(:geo_path_detail).permit(:surface_id, :name)
      @detail=Geo::PathDetail.new(detail_params)
      if @detail.save(user:current_user)
        Geo::PathDetail.numerate(@detail.surface)
        redirect_to geo_path_detail_url(id: @detail.id), notice: 'გზის დეტალი დამატებულია'
      end
    else
      @detail=Geo::PathDetail.new(surface_id: params[:surface_id])
    end
  end

  # def edit
  #   @title='გზის საფარის რედაქტირება'
  #   @surface=Geo::PathSurface.find(params[:id])
  #   if request.post?
  #     surface_params=params.require(:geo_path_surface).permit(:name)
  #     @surface.update_attributes(surface_params.merge(user:current_user))
  #     redirect_to geo_path_surface_url(id:@surface.id), notice: 'საფარი შეცვლილია'
  #     Geo::PathSurface.numerate(@surface.type)
  #   end
  # end

  # def show
  #   @title='გზის საფარის თვისებები'
  #   @surface=Geo::PathSurface.find(params[:id])
  # end

  def delete
    detail=Geo::PathDetail.find(params[:id]); surface=detail.surface
    if detail.can_delete?
      detail.destroy
      Geo::PathDetail.numerate(surface)
      redirect_to geo_path_details_url, notice: 'გზის დეტალი წაშლილია'
    else
      redirect_to geo_path_detail_url(id:detail.id), alert: 'წაშლა დაუშვებელია: დამოკიდებული ობიექტები'
    end
  end

  # def up
  #   surface=Geo::PathSurface.find(params[:id]) ; surface.up
  #   redirect_to geo_path_surfaces_url, notice: 'ნუმერაცია შეცვლილია'
  # end

  # def down
  #   surface=Geo::PathSurface.find(params[:id]) ; surface.down
  #   redirect_to geo_path_surfaces_url, notice: 'ნუმერაცია შეცვლილია'
  # end

  protected
  def nav
    @nav=super
    @nav['გზის დეტალები']=geo_path_details_url
    # if @surface
    #   @nav[@surface.name]=geo_path_surface_url(id:@surface.id) if 'edit'==action_name
    #   @nav[@title]=nil
    # end
  end
end
