class PokemonsController < ApplicationController
  before_action :set_pokemon, only: %i[ show edit update destroy ]

  # GET /pokemons or /pokemons.json
  def index
    @pokemons = Pokemon.all
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
    @pokemons = Pokemon.all.sort_by { |pokemon| -pokemon.win_loss_ratio }
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
