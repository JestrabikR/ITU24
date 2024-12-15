// Author: Ondřej Hruboš (xhrubo01)
// File: helper.js

export const APIURL = "http://127.0.0.1:5000";

export function truncate(str){
	if(str.length > 100){
		return str.substring(0, 97) + "...";
	}
	return str;
}

export function sanitize(string) {
	return string.replace(/[\\]/g, '\\\\')
    .replace(/[\"]/g, '\\\"')
    .replace(/[\/]/g, '\\/')
    .replace(/[\b]/g, '\\b')
    .replace(/[\f]/g, '\\f')
    .replace(/[\n]/g, '\\n')
    .replace(/[\r]/g, '\\r')
    .replace(/[\t]/g, '\\t');
}

export async function imageToBase64(e) {
	var file = (e.target).files?.[0];
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onloadend = () => {
			resolve(reader.result);  // This contains the base64 encoded result
		};

		reader.onerror = (error) => {
			reject(error);
		};

		// Read the file as Data URL (base64)
		reader.readAsDataURL(file);
	})
;}
