# -*- encoding : utf-8 -*-
class Api::UsersController < ApiController
  def login
    @user=Sys::User.authenticate(params[:username], params[:password])
    unless @user and @user.active
      render json: {error: 'არასწორი მომხამრებლი ან პაროლი'}
    end
  end

  def track_point
    Tracking::Path.add_point(Sys::User.find(params[:id]), params[:lat].to_f, params[:lng])
    render text: 'ok'
  end
end