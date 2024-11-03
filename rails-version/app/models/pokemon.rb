class Pokemon < ApplicationRecord
  has_many :won_votes, class_name: 'Vote', foreign_key: 'winner_id'
  has_many :lost_votes, class_name: 'Vote', foreign_key: 'loser_id'

  def self.random_pair
    val = order("RANDOM()").limit(2).to_a
    puts "Random pair: #{val.map(&:name).join(', ')}"
    puts "Leaving random pair fetcher"
    val
  end

  def win_loss_ratio
    total_votes = won_votes.count + lost_votes.count
    return 0 if total_votes == 0
    
    (won_votes.count.to_f / total_votes * 100).round(2)
  end

  def win_percentage
    total_votes = won_votes.count + lost_votes.count
    return 0 if total_votes == 0

    (won_votes.count.to_f / total_votes * 100).round(2)
  end

  def loss_percentage
    total_votes = won_votes.count + lost_votes.count
    return 0 if total_votes == 0

    (lost_votes.count.to_f / total_votes * 100).round(2)
  end
end