
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.6.0
 * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
 */
Prisma.prismaVersion = {
  client: "6.6.0",
  engine: "f676762280b54cd07c770017ed3711ddde35f37a"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  email: 'email',
  emailVerified: 'emailVerified',
  password: 'password',
  image: 'image',
  role: 'role',
  status: 'status',
  createdAt: 'createdAt',
  lastLogin: 'lastLogin',
  isSigninSuccess: 'isSigninSuccess',
  resetToken: 'resetToken',
  resetTokenExpiry: 'resetTokenExpiry'
};

exports.Prisma.ServiceScalarFieldEnum = {
  id: 'id',
  title: 'title',
  callOutCharges: 'callOutCharges',
  ratePerHour: 'ratePerHour',
  experience: 'experience',
  areaOfService: 'areaOfService',
  email: 'email',
  contactNumber: 'contactNumber',
  companyType: 'companyType',
  address: 'address',
  description: 'description',
  isFeatured: 'isFeatured',
  isEnabled: 'isEnabled',
  category: 'category',
  featuredStartDate: 'featuredStartDate',
  featuredEndDate: 'featuredEndDate',
  pictureUrl: 'pictureUrl',
  featureDays: 'featureDays',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WantedItemScalarFieldEnum = {
  id: 'id',
  title: 'title',
  location: 'location',
  description: 'description',
  imageUrl: 'imageUrl',
  userId: 'userId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.BusinessForSaleScalarFieldEnum = {
  id: 'id',
  title: 'title',
  businessType: 'businessType',
  location: 'location',
  description: 'description',
  annualTurnover: 'annualTurnover',
  reasonFoSale: 'reasonFoSale',
  userId: 'userId',
  imageUrl: 'imageUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ContactInfoScalarFieldEnum = {
  id: 'id',
  email: 'email',
  phone: 'phone',
  fullName: 'fullName',
  wantedId: 'wantedId',
  businessId: 'businessId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.SellerProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  businessName: 'businessName',
  city: 'city',
  country: 'country',
  phoneNumber: 'phoneNumber',
  stripeAccountId: 'stripeAccountId',
  stripStatus: 'stripStatus',
  verified: 'verified'
};

exports.Prisma.SellerBankInfoScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  accountHolder: 'accountHolder',
  sortCode: 'sortCode',
  accountNumber: 'accountNumber',
  bankName: 'bankName',
  iban: 'iban',
  swiftCode: 'swiftCode',
  paypalEmail: 'paypalEmail',
  preferredMethod: 'preferredMethod',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.AdminSettingScalarFieldEnum = {
  id: 'id',
  key: 'key',
  value: 'value',
  type: 'type',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  price: 'price',
  discountPercentage: 'discountPercentage',
  discountPrice: 'discountPrice',
  dealStartDate: 'dealStartDate',
  dealEndDate: 'dealEndDate',
  isDealActive: 'isDealActive',
  imagesUrl: 'imagesUrl',
  videoUrl: 'videoUrl',
  isFeatured: 'isFeatured',
  featureDays: 'featureDays',
  weight: 'weight',
  featuredStartDate: 'featuredStartDate',
  featuredEndDate: 'featuredEndDate',
  condition: 'condition',
  categoryId: 'categoryId',
  sellerId: 'sellerId',
  slug: 'slug',
  units: 'units',
  stock: 'stock',
  socialMediaPosted: 'socialMediaPosted',
  status: 'status',
  createdAt: 'createdAt',
  markAsDeleted: 'markAsDeleted'
};

exports.Prisma.OrderPaymentScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  sellerId: 'sellerId',
  amount: 'amount',
  paymentIntentId: 'paymentIntentId',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  isAdminPaidToSeller: 'isAdminPaidToSeller',
  shippingProofUrl: 'shippingProofUrl',
  trackingNumber: 'trackingNumber',
  shippedAt: 'shippedAt'
};

exports.Prisma.OrderScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  totalPrice: 'totalPrice',
  status: 'status',
  createdAt: 'createdAt',
  commisionRate: 'commisionRate',
  shippingAddress: 'shippingAddress',
  shippingCity: 'shippingCity',
  shippingCountry: 'shippingCountry',
  shippingPostalCode: 'shippingPostalCode',
  shippingPhone: 'shippingPhone'
};

exports.Prisma.NotificationOrderScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  status: 'status'
};

exports.Prisma.MessageScalarFieldEnum = {
  id: 'id',
  content: 'content',
  sender: 'sender',
  orderId: 'orderId',
  senderUserId: 'senderUserId',
  receiverUserId: 'receiverUserId',
  createdAt: 'createdAt',
  userId: 'userId'
};

exports.Prisma.OrderItemScalarFieldEnum = {
  id: 'id',
  orderId: 'orderId',
  productId: 'productId',
  sellerId: 'sellerId',
  quantity: 'quantity',
  unitPrice: 'unitPrice',
  isReadSeller: 'isReadSeller',
  isReadBuyer: 'isReadBuyer',
  status: 'status',
  paymentIntentId: 'paymentIntentId',
  createdAt: 'createdAt',
  shippingProofUrl: 'shippingProofUrl',
  trackingNumber: 'trackingNumber',
  shippedAt: 'shippedAt'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  imageUrl: 'imageUrl',
  parentId: 'parentId',
  slug: 'slug',
  sub_subName: 'sub_subName',
  status: 'status',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  deletedAt: 'deletedAt'
};

exports.Prisma.VideoScalarFieldEnum = {
  id: 'id',
  title: 'title',
  url: 'url',
  description: 'description',
  thumbnail: 'thumbnail',
  category: 'category',
  createdAt: 'createdAt'
};

exports.Prisma.InquiryScalarFieldEnum = {
  id: 'id',
  buyerId: 'buyerId',
  productId: 'productId',
  sellerId: 'sellerId',
  subject: 'subject',
  message: 'message',
  response: 'response',
  buyerDeleted: 'buyerDeleted',
  sellerDeleted: 'sellerDeleted',
  buyerRead: 'buyerRead',
  sellerRead: 'sellerRead',
  buyerStarred: 'buyerStarred',
  sellerStarred: 'sellerStarred',
  createdAt: 'createdAt'
};

exports.Prisma.RatingScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  productId: 'productId',
  stars: 'stars',
  comment: 'comment',
  createdAt: 'createdAt'
};

exports.Prisma.AccountScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  type: 'type',
  provider: 'provider',
  providerAccountId: 'providerAccountId',
  refresh_token: 'refresh_token',
  access_token: 'access_token',
  expires_at: 'expires_at',
  token_type: 'token_type',
  scope: 'scope',
  id_token: 'id_token',
  session_state: 'session_state'
};

exports.Prisma.SessionScalarFieldEnum = {
  id: 'id',
  sessionToken: 'sessionToken',
  userId: 'userId',
  expires: 'expires'
};

exports.Prisma.VerificationTokenScalarFieldEnum = {
  identifier: 'identifier',
  token: 'token',
  expires: 'expires'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.Role = exports.$Enums.Role = {
  BUYER: 'BUYER',
  SELLER: 'SELLER',
  ADMIN: 'ADMIN'
};

exports.UserStatus = exports.$Enums.UserStatus = {
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  INACTIVE: 'INACTIVE'
};

exports.CompanyType = exports.$Enums.CompanyType = {
  COMPANY: 'COMPANY',
  PRIVATE: 'PRIVATE'
};

exports.ServiceCategory = exports.$Enums.ServiceCategory = {
  LAUNDRY: 'LAUNDRY',
  DRY_CLEANING: 'DRY_CLEANING',
  FINISHING: 'FINISHING'
};

exports.StripStatus = exports.$Enums.StripStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED'
};

exports.SettingType = exports.$Enums.SettingType = {
  GENERAL: 'GENERAL',
  PAYMENT: 'PAYMENT',
  EMAIL: 'EMAIL',
  SECURITY: 'SECURITY'
};

exports.ProductCondition = exports.$Enums.ProductCondition = {
  NEW: 'NEW',
  USED: 'USED',
  LIKE_NEW: 'LIKE_NEW'
};

exports.ProductStatus = exports.$Enums.ProductStatus = {
  HIDDEN: 'HIDDEN',
  ACTIVE: 'ACTIVE',
  DELETING: 'DELETING'
};

exports.OrderPaymentStatus = exports.$Enums.OrderPaymentStatus = {
  PENDING: 'PENDING',
  CAPTURED: 'CAPTURED',
  REFUNDED: 'REFUNDED',
  PAID: 'PAID',
  REQUIRE_CAPTURE: 'REQUIRE_CAPTURE',
  CANCELLED: 'CANCELLED',
  SHIPPED: 'SHIPPED'
};

exports.OrderStatus = exports.$Enums.OrderStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  REQUIRE_CAPTURE: 'REQUIRE_CAPTURE',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
};

exports.NotificationStatus = exports.$Enums.NotificationStatus = {
  UNREAD: 'UNREAD',
  READ: 'READ',
  ARCHIVED: 'ARCHIVED'
};

exports.OrderItemStatus = exports.$Enums.OrderItemStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  RETURNED: 'RETURNED'
};

exports.CategrySatuts = exports.$Enums.CategrySatuts = {
  HIDDEN: 'HIDDEN',
  ACTIVE: 'ACTIVE',
  DELETING: 'DELETING'
};

exports.Prisma.ModelName = {
  User: 'User',
  Service: 'Service',
  WantedItem: 'WantedItem',
  BusinessForSale: 'BusinessForSale',
  ContactInfo: 'ContactInfo',
  SellerProfile: 'SellerProfile',
  SellerBankInfo: 'SellerBankInfo',
  AdminSetting: 'AdminSetting',
  Product: 'Product',
  OrderPayment: 'OrderPayment',
  Order: 'Order',
  NotificationOrder: 'NotificationOrder',
  Message: 'Message',
  OrderItem: 'OrderItem',
  Category: 'Category',
  Video: 'Video',
  Inquiry: 'Inquiry',
  Rating: 'Rating',
  Account: 'Account',
  Session: 'Session',
  VerificationToken: 'VerificationToken'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }

        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
