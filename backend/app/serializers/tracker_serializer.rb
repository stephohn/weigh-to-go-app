class TrackerSerializer < ActiveModel::Serializer
  attributes :id, :content, :tracker_id
  belongs_to :tracker
end
