class Pokemon < ApplicationRecord
  has_many :won_votes, class_name: 'Vote', foreign_key: 'winner_id', counter_cache: true
  has_many :lost_votes, class_name: 'Vote', foreign_key: 'loser_id', counter_cache: true

  def self.random_pair
    order("RANDOM()").limit(2)
  end

  def self.sorted_by_win_loss_ratio
    select("pokemons.*,
            CASE
              WHEN (won_votes_count + lost_votes_count) = 0 THEN 0
              ELSE (100.0 * won_votes_count / (won_votes_count + lost_votes_count))
            END AS win_loss_ratio")
      .order(win_loss_ratio: :desc, won_votes_count: :desc)
  end

  def win_loss_ratio
    value = read_attribute(:win_loss_ratio)
    return value.to_f.round(2) if value

    total_votes = won_votes_count + lost_votes_count
    return 0 if total_votes == 0

    (100.0 * won_votes_count / total_votes).round(2)
  end

  def win_percentage
    win_loss_ratio
  end

  def loss_percentage
    total_votes = won_votes_count + lost_votes_count
    return 0 if total_votes == 0

    (100.0 * lost_votes_count / total_votes).round(2)
  end
end
