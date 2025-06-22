
export const roles = [

   {
    role: "vendor",
    permissions:[
        'postService',
        'getServices',
        'getServiceById',
        'getMyServices',
        'deleteMyService',
        'patchService'   
    ],
   },
   {

    role: "customer",
    permissions:[
        'getAllServices',
        'getServiceById',
    ]
   }
];

export function checkPermission (role, action){
    if (role === 'vendor') {
        return permission.vendor.includes(action);
    } else if (role === 'customer') {
        return permission.customer.includes(action);
    }
    return false;
}
