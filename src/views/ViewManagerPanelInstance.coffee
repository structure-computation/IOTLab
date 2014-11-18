# Copyright 2012 Structure Computation  www.structure-computation.com
# Copyright 2012 Hugo Leclerc
#
# This file is part of Soda.
#
# Soda is free software: you can redistribute it and/or modify
# it under the terms of the GNU Lesser General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Soda is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Lesser General Public License for more details.
# You should have received a copy of the GNU General Public License
# along with Soda. If not, see <http://www.gnu.org/licenses/>.



# Link between TreeData and CanvasManager
class ViewManagerPanelInstance extends LayoutManagerPanelInstance
    constructor: ( el, @app_data, @view_item, undo_manager ) ->
        super el
        
        @divView = document.createElement "div"
        @divView.style.position = "absolute"
        @_manage_is_chown = false
        #
        
            
        
  
        #
        bind @app_data.selected_canvas_pan, =>
            @_update_borders()

            
    destructor: ->
        super()

    # called each time panel is resized (including the first size definition)
    render: ( info ) ->

        @el.appendChild @div
        #@div.appendChild @divTopCanvas
        @div.appendChild @divView
        @p_min = info.p_min
        @p_max = info.p_max
        @_update_borders()
        
        w = info.p_max[ 0 ] - info.p_min[ 0 ] 
        h = info.p_max[ 1 ] - info.p_min[ 1 ] - 30
    #
    _update_borders: ->        
        s = 1 * @app_data.selected_canvas_pan.contains( @view_item._panel_id )
        
        
        @div.style.left   = @p_min[ 0 ] - s
        @div.style.top    = @p_min[ 1 ] - s
        @div.style.width  = @p_max[ 0 ] - @p_min[ 0 ] 
        @div.style.height = @p_max[ 1 ] - @p_min[ 1 ]
        #@div.style.background = "#e5e5e5"

        if s
            @div.style.borderWidth = 1
            add_class @div, "SelectedCanvas"
        else
            @div.style.borderWidth = 0
            rem_class @div, "SelectedCanvas"
        
        
        @divView.style.left   = 0
        @divView.style.top    = 30
        @divView.style.width  = @p_max[ 0 ] - @p_min[ 0 ]
        @divView.style.height = @p_max[ 1 ] - @p_min[ 1 ] - 30
        
        module_manage = new TreeAppModule_PanelManagerTop
        @_show_actions_module_manage module_manage.actions, module_manage
                 
    
    _show_actions_module_manage: ( actions, module ) ->
        if !@_manage_is_chown
            index_left = 0
            for c in actions when c.ico?
                do ( c ) =>
#                     alert (@p_max[ 0 ] - @p_min[ 0 ] - (index_left * 30) - 2)
                    elem = new_dom_element
                        parentNode: @div
                        style     :
                            paddingRight: "4px"
                            paddingTop: "2px"
                            background : "#262626"
                            width: 30
                            height: 30
                            # "#262626"
                            #display: "block"
                            cssFloat : "right"
                            #zIndex : 1000
                            #position : "relative"
#                         onclick   : ( evt ) => 
#                             for fun in @cm.select_canvas_fun
#                                 fun @cm, evt
#                             c.fun evt, @app_data._views[ 0 ]
                    
#                     elem.style.right   = (@p_max[ 0 ] - (index_left * 40) - 5)
#                     elem.style.top    = 0
#                     elem.style.width  = 30
#                     elem.style.height = 30
                                
                    index_left += 1
                    new_dom_element
                        parentNode: elem
                        nodeName  : "img"
                        src       : c.ico
                        alt       : ""
                        title     : c.txt
                        height    : 22
                        style     :
                            marginTop: "2px"
                            paddingRight: "4px"
                            float : "left"
                            
                    if c.sub?.act?
                        @_show_actions_module_manage c.sub.act, module
                        return true
        @_manage_is_chown = true