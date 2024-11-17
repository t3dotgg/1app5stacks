class Vote < ApplicationRecord
  belongs_to :winner, class_name: 'Pokemon', counter_cache: :won_votes_count, touch: true
  belongs_to :loser, class_name: 'Pokemon', counter_cache: :lost_votes_count, touch: true

  validate :winner_and_loser_are_different

  private

  def winner_and_loser_are_different
    errors.add(:base, "Winner and loser must be different") if winner_id == loser_id
  end
end
