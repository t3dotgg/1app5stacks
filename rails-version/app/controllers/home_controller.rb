class HomeController < ApplicationController
  def index
    @pokemon_pair = Pokemon.random_pair
    respond_to do |format|
      format.html
      format.json do
        render json: { battlefield: render_to_string(
          partial: "battlefield",
          locals: { pokemon_pair: @pokemon_pair },
          formats: [:html]
        ) }
      end
    end
  end

  def vote
    winner = Pokemon.find(params[:winner_id])
    loser = Pokemon.find(params[:loser_id])

    Vote.create(winner: winner, loser: loser)

    respond_to do |format|
      @pokemon_pair = Pokemon.random_pair
      format.turbo_stream { head :ok }
      format.html { render partial: "battlefield", locals: { pokemon_pair: @pokemon_pair } }
    end
  end
end
