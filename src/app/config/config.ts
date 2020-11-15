import * as API_END_POINT from '../../assets/jsons/app-constants.json';

export class Config {
    // Base URL for Service call
    public static get API_END_POINT(): string { return API_END_POINT['API_END_POINT']; }

    // Base URL for static jsons
    public static get STATIC_JSON_END_POINT(): string { return 'assets/jsons/'; }

    // Version details
    public static get API_VERSION_SHOW(): boolean { return false; }
    public static get API_VERSION_INFO(): string { return 'v1.0.0'; }

    // Is environment in development mode?
    public static get IS_DEV(): boolean { return true; }

    public static SERVICE_IDENTIFIER: any = {

        // LOGIN
        LOGIN: Config.API_END_POINT + 'login',

        // GLOBAL SERVICES
        SAMPLE_TABLE_JSON: Config.STATIC_JSON_END_POINT,
        SAVE_NEW_USER: Config.API_END_POINT + 'addUser',
        GET_SITE_SCHEDULE_DETAILS: Config.API_END_POINT + 'createTicket',
        GET_USER_LIST: Config.API_END_POINT + 'listUsers',
        GET_MATERIALS_LIST: Config.API_END_POINT + 'listMaterials',
        GET_CATEGORIES_LIST: Config.API_END_POINT + 'listCategories',
        GET_TICKET_TYPES_LIST: Config.API_END_POINT + 'listTicketTypes',
        GET_ENGINEERS_LIST: Config.API_END_POINT + 'listAvailableEngineers',
        GET_SITE_LIST: Config.API_END_POINT + 'listSites',
        FETCH_SITE_DETAILS: Config.API_END_POINT + 'fetchSite',
        CREATE_SITE_DETAILS: Config.API_END_POINT + 'createSite',
        GET_TICKET_LIST: Config.API_END_POINT + 'listTickets',
        GET_TICKET_DETAILS: Config.API_END_POINT + 'fetchTicketInfo',
        CREATE_USER: Config.API_END_POINT + 'addUser',
        UPDATE_USER: Config.API_END_POINT + 'editUser',
        FETCH_USER_DETAILS: Config.API_END_POINT + 'fetchUserInfo',
        GET_VISIT_HISTORY: Config.API_END_POINT + 'ticketCalendarHistory',
        ASSIGN_ENGINEERS: Config.API_END_POINT + 'assignEngineers',
        GET_USER_BASIC_INFO: Config.API_END_POINT + 'fetchProfilePic',
        UPLOAD_FILES: Config.API_END_POINT + 'saveDocumnet',
        FETCH_UPLOAD_FILE_DETAILS: Config.API_END_POINT + 'fetchDocuments',
        DOWNLOAD_FILE: Config.API_END_POINT + 'downloadDocument',
        UPDATE_READ_STATUS: Config.API_END_POINT + 'updateReadStatus',
        UPDATE_TICKET_STATUS_START: Config.API_END_POINT + 'startVisit',
        UPDATE_TICKET_STATUS_FINISH: Config.API_END_POINT + 'endVisit',
        UPDATE_GOAL_STATUS: Config.API_END_POINT + 'updateGoals',
        UPDATE_READINESS_STATUS: Config.API_END_POINT + 'updateSiteReadinessStatus',
        FETCH_READINESS_TEMPLATE: Config.API_END_POINT + 'fetchSiteReadinessRequirements',
        FETCH_TEMPLATES: Config.API_END_POINT + 'fetchTemplates',
        DOWNLOAD_DOCUMENT: Config.API_END_POINT + 'downloadDocument',
        TICKET_COUNT: Config.API_END_POINT + 'fetchTicketCount',
        UPLOAD_MOM: Config.API_END_POINT + 'uploadMOM',
        FETCH_MOM_DETAILS: Config.API_END_POINT + 'fetchMomDocument',
        FETCH_NOTIFICATIONS: Config.API_END_POINT + 'listNotifications',
        FETCH_ENGINEER_ICON: Config.API_END_POINT + 'fetchEngineers',
        FETCH_DASHBOARD_DETAILS: Config.API_END_POINT + 'dashboard',
        CREATE_MOM: Config.API_END_POINT + 'createMOM',
        DELETE_USER: Config.API_END_POINT + 'deleteUserInfo',
        ACTIVITY_TIMELINE: Config.API_END_POINT + 'activityTimeline',
        SEND_EMAIL_NOTIFICATION: Config.API_END_POINT + 'sendMail',
        DELETE_TICKET: Config.API_END_POINT + 'deleteTicket',

        // Site Expenses

        SAVE_EXPENSES: Config.API_END_POINT + 'saveExpenses',
        SAVE_COMMENTS: Config.API_END_POINT + 'saveComments',
        COMMENT_LIST: Config.STATIC_JSON_END_POINT + 'comments.json',
        GET_EXPENSES_TICKET_LIST: Config.STATIC_JSON_END_POINT + 'expenses.json',

        FETCH_STATE_LIST: Config.STATIC_JSON_END_POINT + 'state-list.json',
        FETCH_FEEDBACK_LIST: Config.API_END_POINT + 'fetchFeedback',

        // P.O && Materials && Project Flow : Services
        fetchPoDetails: Config.API_END_POINT + 'fetchPoDetails',
        listAllMaterials: Config.API_END_POINT + 'productDetails/fetchTable',
        saveMaterial: Config.API_END_POINT + 'saveMaterial',
        saveProductQuantity: Config.API_END_POINT + 'productDetails/updateQuantity',
        deleteMaterial: Config.API_END_POINT + 'deleteMaterial',
        approveMaterial: Config.API_END_POINT + 'approveMaterial',
        fetchProjectTypes: Config.API_END_POINT + 'fetchProjectTypes',
        fetchPurchaseOrders: Config.API_END_POINT + 'fetchPurchaseOrders',
        savePurchaseOrder: Config.API_END_POINT + 'savePurchaseOrder',
        deletePurchaseOrder: Config.API_END_POINT + 'deletePurchaseOrder',
        fetchPurchaseOrderDetails: Config.API_END_POINT + 'fetchPurchaseOrderDetails',
        cancelPurchaseOrder: Config.API_END_POINT + 'cancelPurchaseOrder',
        fetchPoTickets: Config.API_END_POINT + 'fetchPoTickets',
        fetchPoChallans: Config.API_END_POINT + 'purchaseOrder/fetchDeliveryChallan',
        linkPurchaseOrder: Config.API_END_POINT + 'linkPurchaseOrder',
        loadProductDetails: Config.API_END_POINT + 'productDetails/transactionTable',

        // SITE CONFIGURATION
        listSitesInTableFormat: Config.API_END_POINT + 'listSitesInTableFormat',
        deleteSite: Config.API_END_POINT + 'deleteSite',
        createSiteUpdated: Config.API_END_POINT + 'createSiteUpdated',

        // DELIVERY CHALLAN
        GET_DC_LIST: Config.API_END_POINT + 'listDeliveryChallan',
        GET_DC_DETAILS_LIST: Config.API_END_POINT + 'deliveryChallan/fetchTable',
        GET_DISPATCH_LIST: Config.API_END_POINT + 'purchaseOrder/fetchTable',
        DELETE_DC: Config.API_END_POINT + 'deleteDeliveryChallan',
        getDCDeatils: Config.API_END_POINT + 'fetchDeliveryChallanDetails',
        SAVEDC: Config.API_END_POINT + 'saveDeliveryChallan',
        FETCH_COMPANIES_NAMES: Config.API_END_POINT + 'listCompanynames',
        SEND_DC_MAIL: Config.API_END_POINT + 'sendMailDeliveryChallan',
        DC_PDF: Config.API_END_POINT + 'downloadDeliveryChallan',
        DC_EXPORT: Config.API_END_POINT + 'deliveryChallan/download',
        DC_EXPORT_POST: Config.API_END_POINT + 'deliveryChallan/export/excel',
        GET_DC_NUM: Config.API_END_POINT + 'createChallanNo',
        SAVE_DC_DETAILS: Config.API_END_POINT + '',

        // Config Delivery Challan
        GET_DC_CONFIG_LIST: Config.API_END_POINT + 'listCompanies',
        DELETE_DC_CONFIG: Config.API_END_POINT + 'deleteCompanyDetails',
        FETCH_DCCONFIG: Config.API_END_POINT + 'fetchCompanyDetails',
        SAVE_DC_CONFIG: Config.API_END_POINT + 'saveCompanyDetails',
        GET_MATERIAL_CARRY_LIST: Config.API_END_POINT + 'materialCarryList',
        GET_MATERIAL_CARRY_DETAILS: Config.API_END_POINT + 'materialCarryDetails',
        FETCH_VENDOR: Config.API_END_POINT + 'listVendorMaster',
        SAVE_VENDOR_DETAILS: Config.API_END_POINT + 'saveVendorDetails',
        FETCH_VENDOR_DETAILS: Config.API_END_POINT + 'fetchVendorDetails',
        DELETE_VENDOR: Config.API_END_POINT + 'deleteVendors',
        FETCH_PRODUCTS: Config.API_END_POINT + 'listProducts',
        FETCH_PRODUCTS_ALL: Config.API_END_POINT + 'listAllProducts',
        SAVE_PRODUCTS: Config.API_END_POINT + 'saveProducts',
        DELETE_PRODUCTS: Config.API_END_POINT + 'deleteProducts',

        // Repair Recipt api
        FETCH_REPAIR_LIST: Config.API_END_POINT + 'repairReceipt/list',
        SAVE_REPAIR_RECEIPT: Config.API_END_POINT + 'repairReceipt/save',
        FETCH_REPAIR_RECEIPT: Config.API_END_POINT + 'repairReceipt/fetch',
        DELETE_REPAIR_RECEIPT: Config.API_END_POINT + 'repairReceipt/delete',

        // Material Recipt api
        FETCH_MATERIAL_LIST: Config.API_END_POINT + 'listMaterialReceipt',
        SAVE_MATERIAL_RECEIPT: Config.API_END_POINT + 'saveMaterialReceipt',
        FETCH_MATERIAL_RECEIPT: Config.API_END_POINT + 'fetchMaterialReceipt',
        DELETE_MATERIAL_RECEIPT: Config.API_END_POINT + 'deleteMaterialReceipt',
        GET_PRODUCT_BY_VENDOR_ID: Config.API_END_POINT + 'fetchProductsByVendor',

        FETCH_DROPDOWN_LIST: Config.API_END_POINT + 'commonDropDownList',
        SSO_LOGIN: Config.API_END_POINT + 'loginSSO',

        // ADD_MATERIAL_RECEIPT: Config.API_END_POINT + 'saveMaterialReceipt',
        // EDIT_MATERIAL_RECEIPT: Config.API_END_POINT + 'fetchMaterialReceipt',
        // DELETE_MATERIAL_RECEIPT: Config.API_END_POINT + 'deleteMaterialReceipt',


    };

    public static JSON_IDENTIFIER: any = {
        listAllMaterials: Config.STATIC_JSON_END_POINT + 'materials.json',
        GET_DC_LIST: Config.STATIC_JSON_END_POINT + 'dcList.json',
        getDCDeatils: Config.STATIC_JSON_END_POINT + 'getDCdetails.json',
        getSideBar: Config.STATIC_JSON_END_POINT + 'getSideBar.json',
        FETCH_SETTINGS: Config.STATIC_JSON_END_POINT + 'getSettingsList.json',
        FETCH_VENDOR: Config.STATIC_JSON_END_POINT + 'vendor-master.json',
        FETCH_PRODUCTS: Config.STATIC_JSON_END_POINT + 'products.json',
        FETCH_MATERIAL_RECEIPT: Config.STATIC_JSON_END_POINT + 'material-receipt.json',
        LOAD_VENDOR_EDIT: Config.STATIC_JSON_END_POINT + 'edit_vendor.json',
        LOAD_VENDOR_DROPDOWN: Config.STATIC_JSON_END_POINT + 'vendor_dropdown.json',
        LOAD_PRODUCT_DROPDOWN: Config.STATIC_JSON_END_POINT + 'product_list_dropdown.json',
        LOAD_RECEIPT_EDIT: Config.STATIC_JSON_END_POINT + 'edit_receipt.json',
    };

    // SESSION RELATED CONSTANTS
    public static get USER_IDENTIFIER(): string { return 'klUserId'; }
    public static get USER_ROLE(): string { return 'klUserRole'; }
    public static get USER_CATEGORY(): string { return 'klUserCategory'; }
    public static get SESSION_STATUS(): string { return 'klIsLoggedin'; }
    public static get SESSION_USER_NAME(): string { return 'klUserName'; }
    public static get GOOGLE_AUTH_TOKEN(): string { return 'google_auth_token'; }

    public static CONSTANTS: any = {
        USER_ROLES: [
            { value: 'manager', label: 'Manager' },
            { value: 'sales', label: 'Sales' },
            { value: 'offshoreSupportEngineer', label: 'Offshore Support Engineer' },
            { value: 'siteEngineer', label: 'SiteEngineer' },
            { value: 'accounts', label: 'Accounts' },
            { value: 'innovationLabUser', label: 'Innovation Lab User' }
        ],
        SESSION_KEY: 'kl-site-planner',
        PROFILE_PAGE_ACCESS_LIST: ['manager', 'sales', 'offshoreSupportEngineer', 'siteEngineer', 'accounts', 'innovationLabUser']
    };

    // Error Handling Message
    public static get ERROR_HANDLER(): string { return 'Something went wrong. Please try again.'; }

}
