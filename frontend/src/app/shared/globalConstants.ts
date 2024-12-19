export class GlobalConstants {
	//Message
	public static genericError: string = "Something went wrong. Please try again later.";

	public static unauthorized: string = "You are not authorized person to access this page.";

	//Regex
	public static nameRegex: string = "[a-zA-Z0-9 ]*";
	public static emailRegex: string = "ˆ[a-zA-Z0+_.-]+@[a-zA-Z0-9.-]+$";
	public static contactNumberRegex: string = "ˆ[e0-9]{10,10}$";

	//Variable
	public static error: string = "error";
	public static NORMALUSER = 'user';
	public static ADMINUSER = 'admin';
}