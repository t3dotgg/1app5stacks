class PokemonsController < ApplicationController
  def index
    cache_key = Pokemon.all.cache_key_with_version
    @pokemons = Rails.cache.fetch(cache_key, expires_in: 1.day) do
      Pokemon.all.to_a
    end

    timestamp = cache_key.split('-').last
    last_modified_time = Time.strptime(timestamp, "%Y%m%d%H%M%S")
    fresh_when last_modified: last_modified_time, strong_etag: @pokemons
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
end
