
export type BasePayload = {
    [ key : string ] : string | File
}

export interface FileUploadBody extends BasePayload {
    file : File;
    name : string;
}