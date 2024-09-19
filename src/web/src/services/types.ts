/** Type definition to make a clear distinction between successful and failed responses in the documentation */
export type ApiFailReason = string;
 
/** Type definition of function used to resolve a promise */
// eslint-disable-next-line @typescript-eslint/ban-types
export type PromiseResolve = ((value: any) => void) & {};
 
/** Type definition of function used to reject a promise */
// eslint-disable-next-line @typescript-eslint/ban-types
export type PromiseReject = ((reason?: string) => void) & {};
 
/** Represents a failed response from the API */
export interface ApiFailResponse {
    /** Reason why the response failed */
    reason: string;
}
 
/**
 * Holds all options for the HBO-ICT.Cloud API
 */
export type Options = {
    /** URL of the HBO-ICT.Cloud API */
    url: string;
    /** API-Key to authenticate yourself with the HBO-ICT.Cloud API */
    apiKey: string;
    /** Name of the database you want to query by default */
    database: string;
    /** Name of the environment you want to manipulate files on */
    environment: ("mockup" | "dev" | "live") | string;
};
 
/**
 * Represents a single email contact
 */
export interface EmailAddress {
    /** Name of the contact */
    name?: string;
    /** Email address of the contact */
    address: string;
}
 
/**
 * Represents an email. Is only considered valid when all required fields are provided and either {@link text} or {@link html} have a value.
 */
export interface Email {
    /** Sender of the email */
    from: EmailAddress;
    /** Receivers of the email */
    to: EmailAddress[] | string;
    /** Other receivers of the email */
    cc?: EmailAddress[] | string;
    /** Blind receivers of the email */
    bcc?: EmailAddress[] | string;
    /** Subject of the email */
    subject: string;
    /** Contents of the email as text */
    text?: string;
    /** Contents of the email as html */
    html?: string;
}
 
/**
 * Represents the Data-URL of a file
 */
export interface DataURL {
    /** Filename of the file */
    fileName: string;
    /** Extension of the file, can be empty. */
    extension: string;
    /** MIME-type of the file */
    mimeType: string;
    /** Is set to `true` when the {@link mimeType} represents an image, otherwise `false`. */
    isImage: boolean;
    /** Data-URL of the file */
    url: string;
}