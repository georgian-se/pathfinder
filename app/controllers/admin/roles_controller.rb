# -*- encoding : utf-8 -*-
class Admin::RolesController < ApplicationController
  def index
    @title=t('pages.admin_roles.index.title')
    @roles=Sys::Role.desc(:_id).paginate(page:params[:page], per_page:10)
  end

  def new
    @title=t('pages.admin_roles.new.title')
    if request.post?
      @role=Sys::Role.new(role_params)
      if @role.save
        redirect_to admin_role_url(id:@role.id), notice:t('pages.admin_roles.new.role_created')
      end
    else
      @role=Sys::Role.new
    end
  end

  protected
  def nav
    @nav=super
    @nav[t('pages.admin_roles.index.title')]=admin_roles_url
    if @role
      @nav[@role.name]=admin_role_url(id:@user.id) unless @role.new_record?
      @nav[@title]=nil unless action_name=='show'
    end
  end

  private
  def role_params; params.require(:sys_role).permit(:name,:description) end
end
