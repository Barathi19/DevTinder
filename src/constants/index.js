const CONNECTION_STATUS = {
  IGNORED: "ignored",
  INTERESTED: "interested",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
};

const GENDER = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
};

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

module.exports = { CONNECTION_STATUS, GENDER, USER_SAFE_DATA };
