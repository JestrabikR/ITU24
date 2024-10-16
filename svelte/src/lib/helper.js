export const APIURL = "http://127.0.0.1:5000";

export function truncate(str){
	if(str.length > 100){
		return str.substring(0, 97) + "...";
	}
	return str;
}
