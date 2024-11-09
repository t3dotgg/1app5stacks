class PokemonsController < ApplicationController
  before_action :set_pokemon, only: %i[ show edit update destroy ]

  # GET /pokemons or /pokemons.json
  def index
    cache_key = Pokemon.all.cache_key_with_version
    @pokemons = Rails.cache.fetch(cache_key, expires_in: 1.day) do
      Pokemon.all.to_a
    end

    timestamp = cache_key.split('-').last
    last_modified_time = Time.strptime(timestamp, "%Y%m%d%H%M%S")
    fresh_when last_modified: last_modified_time, strong_etag: @pokemons
  end

  # GET /pokemons/1 or /pokemons/1.json
  def show
  end

  # GET /pokemons/new
  def new
    # @pokemon = Pokemon.new
  end

  # GET /pokemons/1/edit
  def edit
  end

  # POST /pokemons or /pokemons.json
  def create
  end

  # PATCH/PUT /pokemons/1 or /pokemons/1.json
  def update
  end

  # DELETE /pokemons/1 or /pokemons/1.json
  def destroy
  end

  def results
    cache_key = Pokemon.sorted_by_win_loss_ratio.cache_key_with_version
    @pokemons = Rails.cache.fetch(cache_key, expires_in: 1.day) do
      Pokemon.sorted_by_win_loss_ratio.to_a
    end

    timestamp = cache_key.split('-').last
    last_modified_time = Time.strptime(timestamp, "%Y%m%d%H%M%S")
    fresh_when last_modified: last_modified_time, strong_etag: @pokemons
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_pokemon
      @pokemon = Pokemon.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def pokemon_params
      params.require(:pokemon).permit(:name, :image_url)
    end
end
