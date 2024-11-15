class HomeController < ApplicationController
  def index
    @pokemon_pair = Pokemon.random_pair
  end

  def vote
    winner = Pokemon.find(params[:winner_id])
    loser = Pokemon.find(params[:loser_id])

    Vote.create(winner: winner, loser: loser)

    respond_to do |format|
      format.turbo_stream do
        @pokemon_pair = Pokemon.random_pair
      end
      format.html { redirect_to root_path }
    end
  end
end
