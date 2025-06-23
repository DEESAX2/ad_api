
export const roles = [

   {
    role: "customer",
    permissions:[
        'getAllServices',
        'getServiceById',
    ]
   },

    {
    role: "vendor",
    permissions:[
        'postService',
        'getServices',
        'getServiceById',
        'getMyServices',
        'deleteMyService',
        'patchService',  
    ]
   },

];

