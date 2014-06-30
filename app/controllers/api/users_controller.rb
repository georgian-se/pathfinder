# -*- encoding : utf-8 -*-
class Api::UsersController < ApiController
  def index; @users = Sys::User.where(active: true).asc(:username) end

  def login
    authenticate do |user|
      @user = user
    end
  end

  def track_point
    Tracking::Path.add_point(Sys::User.find(params[:userid]), params[:lat].to_f, params[:lng])
    render json: {status: 'ok'}
  end
end
