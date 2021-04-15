interface IUser {
  email?: string;
  addedAt?: any;
  lastUpdate?: any;
  userId?: string;
  displayName?: string;
  platform?: string;
  isLoggedIn?: boolean;
  package?: IPackage;
  watchedVideo?: IWatchedVideo[];
  allSurveys?: any[];
  allFeedbacks?: IFeedback[];
  versionNumber?: string;
  userProfile?: string;
  gender?: string;
  ethnicity?: string;
  age?: string;
  paypal?: string;
  address?: IAddress;
  version?: any;
}

interface ILand{
  id?:string;
  title?:string;
  description?:string;
  imageUrl?:string;
  points?:ILandMarks[];
  protectionType?:string; //open, password, qrcode
  passwordOrQrCode?:string;
  dateAdded?:string;
  imageDetail?: string

}
interface IQuestion{
  id?: string
  title?: string
  options?: any[]
  answer?: string
}

interface ILandMarks{
  id?:string;
  indexPosition?:number;   //to show location in slider
  name?:string;
  desc?:string;
  audioURL?:string;
  videoURL?:string;
  imageURL?:string;
  backgroundColor?:string;
  titleColor?:string;
  dateAdded?:string;
}

interface IAddress {
  street?: "";
  city?: "";
  state?: "";
  zip?: "";
}

interface IFeedback {
  id?: string;
  Message?: string;
  Status?: string;
  userEmail?: string;
  userId?: string;
  dateAdded?: string;
}

interface ISurvey {
  id?: string;
  review?: any[];
  surveyType?: string;
  userEmail?: string;
  userId?: string;
  dateAdded?: string;
}

interface IWatchedVideo {
  id?: string;
  userId?: string;
  dateAdded?: string;
}

interface IPackage {
  productId?: string;
  subscriptionPeriodUnitIOS?: string;
  description?: string;
  introductoryPrice?: string;
  title?: string;
  introductoryPriceSubscriptionPeriodIOS?: string;
  introductoryPriceNumberOfPeriodsIOS?: string;
  discounts?: any;
  type?: string;
  localizedPrice?: string;
  introductoryPricePaymentModeIOS?: string;
  price?: string;
  currency?: string;
  subscriptionPeriodNumberIOS?: string;
}

interface ILocation {
  coords: {
    accuracy: number;
    altitude: number;
    altitudeAccuracy: number;
    heading: number;
    latitude: number;
    longitude: number;
    speed: number;
  };
  timeout: number;
}

interface ILockers {
  id?: string;
  latitude?: string;
  longitude?: string;
  locationName?: string;
  mallName?: string;
  lockers?: ILockerInfo[];
  dateAdded?: string;
  dateUpdate?: string;
}

interface ILockerInfo {
  id?: string;
  dateAdded?: string;
  doorStatus?: string;
  number?: string;
  status?: string; //free, reserved
  openUrl?: string;
  closeUrl?: string;
}

interface IUserCounts {
  users?: number;
  lands?:number;
}

interface IUserStats {
  chartCount?: any;
  percentage?: number;
  totalCount?: number;
}

interface JQuery {
  KTDatatable: any;
}

interface IToastMessage {
  message: string;
  type?: string;
}

interface IHistory {
  userPhone?: string;
  startDate: any;
  endDate: any;
  totalBill: any;
  id: string;
  lockerName: string;
  dateAdded?: string;
}

interface IPayment{
  id?:string;
  userId?:string;
  amount?:number;
  payedMonth?:string;
  dateAdded?:string;
}

interface IUploadedProgress {
  bytesTransferred?: number;
  totalBytes?: number;
  progress?: number;
}