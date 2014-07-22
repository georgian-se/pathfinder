# -*- encoding : utf-8 -*-
class Api::TowersController < ApiController
  def show; @tower=Objects::Tower.find(params[:id]) end

  def new
    tower=Objects::Tower.create(tower_params)
    render json:{id:tower.id.to_s}
  end

  def edit
    tower=Objects::Tower.find(params[:id])
    tower.update_attributes(tower_params)
    render json:{id:tower.id.to_s}
  end

  def delete
    tower=Objects::Tower.find(params[:id])
    tower.destroy
    render text:'ok'
  end

  def upload_photo
    tower = Objects::Tower.find(params[:id])
    filename = (0...8).map { (65 + rand(26)).chr }.join # generate random string (A..Z)*8
    file = Tempfile.new(filename)
    file.write(params[:file])
    file.close
    tower.generate_images_from_file(file.path, filename)
    render json: {file: "/uploads/#{tower.id}/large/#{filename}"}
  end

  private
  def tower_params; params.permit(:name,:region_id, :lat, :lng, :category, :description) end
end
