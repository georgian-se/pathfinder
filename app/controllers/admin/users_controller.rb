# -*- encoding : utf-8 -*-
class Admin::UsersController < ApplicationController
  def index
    @title=t('pages.admin_users.index.title')
    @users=Sys::User.desc(:_id).paginate(page:params[:page], per_page:10)
  end

  def new
    @title=t('models.sys_user._actions.new_user')
    if request.post?
      @user=Sys::User.new(user_params)
      if @user.save
        redirect_to admin_users_url, notice: t('pages.admin_users.new.user_created')
      end
    else
      @user=Sys::User.new
    end
  end

  def edit
    @title=t('models.sys_user._actions.edit_user')
    @user=Sys::User.find(params[:id])
    if request.post?
      if @user.update_attributes(user_params)
        redirect_to admin_user_url(id:@user.id), notice: t('pages.admin_users.edit.user_updated')
      end
    end
  end

  protected
  def nav
    @nav=super
    @nav[t('pages.admin_users.index.title')]=admin_users_url
    if @user
      unless @user.new_record? and not action_name=='show'
        @nav[@user.full_name]=admin_user_url(id:@user.id)
      end
      @nav[@title]=nil
    end
  end

  private
  def user_params; params.require(:sys_user).permit(:username,:password,:first_name,:last_name,:mobile) end
end
