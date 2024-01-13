import articleImageSlice from "./articleImageSlice"
import articleSlice from "./articleSlice"
import attractionImage from "./attractionImage"
import attractionSlice from "./attractionSlice"
import commentSlice from "./commentSlice"
import contactSlice from "./contactSlice"
import ticketBookingSlice from "./ticketBookingSlice"
import tourBookingSlice from "./tourBookingSlice"
import tourImageSlice from "./tourImageSlice"
import tourPackageSlice from "./tourPackageSlice"
import userSlice from "./userSlice"
import vehicleSlice from "./vehicleSlice"

const rootReducer = {
  userSlice,
  tourPackageSlice,
  tourImageSlice,
  attractionSlice,
  attractionImage,
  articleSlice,
  articleImageSlice,
  commentSlice,
  contactSlice,
  tourBookingSlice,
  ticketBookingSlice,
  vehicleSlice
}

export default rootReducer