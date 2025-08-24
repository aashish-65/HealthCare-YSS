const {EmergencyAccess} = require("../models/index")

export const grantEmergencyAccess = async (userId, patientId, reason) => {
  return await EmergencyAccess.create({ userId, patientId, reason });
};