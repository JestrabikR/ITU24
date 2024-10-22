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
