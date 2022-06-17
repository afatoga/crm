import { routes } from '../config';
import { Route } from '../types';

export const isEmptyObject = (obj:object) => {
    if (!obj) return false;
    return Object.keys(obj).length === 0;
  };

  /*!
 * Group items from an array together by some criteria or value.
 * (c) 2019 Tom Bremmer (https://tbremer.com/) and Chris Ferdinandi (https://gomakethings.com), MIT License,
 * @param  {Array}           arr      The array to group items from
 * @param  {String|Function} criteria The criteria to group by
 * @return {Object}                   The grouped object
 */
export const groupBy = (arr:any[], criteria:string | Function) => {
	return arr.reduce(function (obj, item) {

		// Check if the criteria is a function to run on the item or a property of it
		var key = typeof criteria === 'function' ? criteria(item) : item[criteria];

		// If the key doesn't exist yet, create it
		if (!obj.hasOwnProperty(key)) {
			obj[key] = [];
		}

		// Push the value to the object
		obj[key].push(item);

		// Return the object to the next item in the loop
		return obj;

	}, {});
};

export const getPageTitleCode = (locationPathname: string) => {

	let titleCode = 'pageTitles.contactsApp'; //default

	routes.forEach((item: Route) => {
		if (item.path === locationPathname) {return titleCode = item.titleCode;}
		else if (item?.subRoutes) {
			const found = item.subRoutes.find((subRoute: Route) => subRoute.path === locationPathname)
			return titleCode = found.titleCode;
		}
	});

	return titleCode;
}

export const capitalizeString = (str: string) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

// export const getPageTitleCode = (location: any) => {
// 	let name = location.pathname.replaceAll("/", "-"); // from /account/settings --> -account-settings
// 	return `pageTitles.${name.substring(1)}`;
// }