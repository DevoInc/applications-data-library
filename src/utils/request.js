import user from '../utils/user';

export function  addPragmas (query, componentId, vault, application) {
  let env = window.location.hostname.split('.')[0];
  let clone = env.split('pre')[1];
  let queryApp = application ? application : baseWeb.pageManager.currentPage;
  return `${query}
    pragma proc.vault.name: "${vault || user.getVault().name}"
    pragma comment.application: "${queryApp}"
    pragma comment.component: "${componentId || ''}"
    pragma comment.user: "${user.getName()}"
    pragma comment.email: "${user.getEmail()}"
    pragma comment.environment: "${env}"
    pragma comment.clone: "${clone || ''}"
    pragma tz: tz("${user.getTimezone()}")
    pragma comment.source: ${JSON.stringify(query)}
    ${lt.app ? `pragma comment.free:"${lt.app.appId}"` : ''}
    `.trim().replace(/^\s*\n/gm, '');
}


export function csvToJson (csv) {
  var lines=csv.split('\n');
  var result = [];
  var headers=lines[0].split(',');
  for(var i=1;i<lines.length;i++){
	  var obj = {};
	  var currentline=lines[i].split(',');
	  for(var j=0;j<headers.length;j++){
		  obj[headers[j]] = currentline[j];
	  }
	  result.push(obj);
  }
  return result;
}
