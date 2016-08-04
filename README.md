# responsive-webmap

## About
A simple HTML-CSS-JS template for responsive webmap/webGIS applications. Based on OpenLayers3, Bootstrap and jQuery. 

## Documentation
This documentation is merely a list of CSS tricks and different options for customzing the webmap interface. 

### OpenLayers 3 for mobile:
* OpenLayers 3: Go mobile <https://openlayersbook.github.io/ch10-openlayers-goes-mobile/example-01.html>
* Add `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">`

### Use bootstrap classes for hidding elements according viewport:
* with bootstrap: http://getbootstrap.com/css/#responsive-utilities
 * `$('.ol-scale-line').addClass('hidden-xs')`
 * `$('.ol-attribution').addClass('hidden-xs')`
* NB: tooltip: used to make a fancy title when onhover. 

### General layout: 
* use the class navbar-fixed-top for this map and set height=100% to most of the tag. The general layout using bootstrap was inspired from <http://esri.github.io/bootstrap-map-js/demo/jquery/maps.html>

### Collapsible panel:
* the div panel was set a `position:absolute`, starting at `bottom: 0px`.
* Alternatively, use `top: 50px`. 
* The height of the div panel was calculated as  `calc(100% - 50px)`, where 50px is the height of the navbar. I did not reach to keep the `height : 100%`. I tried to add `padding-top: 50px` but this does not change the height of the panel, only the position of the panel content. 
* The collapsible behaviour is made by changing the width of the div panel from `300px` to `30px` OR the height from `calc(100% - 50px)` to `30px`.
* The collapsible behaviour is triggered by the `collapsePanel()` function, using jquery functions.
* The panel content (`div#panelContent`) is hidden when the panel is collapsed through the css property opacity using a transition effect, because the transition effect cannot work with the css property display. 
* Therefore, 2 OPTIONS:
 * collapsible by height: in map.js: `$('div#panel').css('height','30px');`
 * collapsible by width: `$('div#panel').css('width','30px');`

### Positionning of openlayers controls: 
* put the ol-zoom at the bottom-right of the map:
```
.ol-zoom {
   top: initial;   
   right: 8px;
   bottom: 6px;
   left: auto;   
}
```
* This option was applied to the mobile screen (@media) viewport. 

* Important for positioning these controls:
 * Use `left:auto;` to avoid the background-color of the ol zoom control spanning from the left side of the screen .
 * Use `top:initial;` to clear the top property that is specified by OpenLayers as bottom will not override top. 

### Showing the hamburger button in mobile

* For unknown reason, the hamburger button did not show because all background-color were the same. It was fixed with simple css. As well as for the dropdown menu. 
However, think about forgetting the hamburger button and use a tab bar at the bottom. <https://techcrunch.com/2014/05/24/before-the-hamburger-button-kills-you/>
