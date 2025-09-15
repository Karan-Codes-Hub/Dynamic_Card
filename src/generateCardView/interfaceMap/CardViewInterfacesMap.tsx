import React, { useEffect, useState } from "react";
import mermaid from "mermaid";
import "./CardViewInterfacesMap.css";

interface InterfaceInfo {
  name: string;
  description: string;
  category: string;
  properties?: string[];
}

const CardViewInterfacesMap: React.FC = () => {
  const [activeInterface, setActiveInterface] = useState("CardViewOptions");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Interface information data
  const interfaceInfo: Record<string, InterfaceInfo> = {
    CardViewOptions: {
      name: "CardViewOptions",
      description: "The main configuration interface that brings together all other interfaces. This is the primary interface you'll work with when implementing the card view.",
      category: "core",
      properties: ["dataMode", "data", "dataItemDescription", "segregatedData", "renderCard", "headerCardView", "content", "layout", "cardStyle", "interactions", "dataOperations", "pagination", "zoom", "virtualScroll", "lazyLoad"]
    },
    DataItem: {
      name: "DataItem",
      description: "Represents a single data item with a unique identifier and dynamic properties.",
      category: "core",
      properties: ["id", "[key: string]"]
    },
    CardInteractions: {
      name: "CardInteractions",
      description: "Combines selection, drag, and click interactions into a single interface.",
      category: "interaction",
      properties: ["selectable", "multiSelect", "onSelect", "draggable", "onDragStart", "onDragEnd", "onClick", "onDoubleClick", "onHover"]
    },
    CardLayoutOptions: {
      name: "CardLayoutOptions",
      description: "Controls how cards are arranged (grid, masonry, carousel, or stack).",
      category: "layout",
      properties: ["type", "columns", "gap", "padding", "gridOptions", "masonryOptions", "carouselOptions", "stackOptions", "breakpoints", "className", "style"]
    },
    CardContentConfig: {
      name: "CardContentConfig",
      description: "Determines how card content is displayed (field config, template, or default view).",
      category: "ui",
      properties: ["contentDisplayType", "content"]
    },
    DataOperations: {
      name: "DataOperations",
      description: "Configures sorting, filtering, and search functionality.",
      category: "data",
      properties: ["sort", "filter", "search"]
    },
    HeaderCardViewOptions: {
      name: "HeaderCardViewOptions",
      description: "Defines the header configuration with search, sort, and download options.",
      category: "ui",
      properties: ["headerConfig", "customHeader", "visible", "style", "title", "additionalActions"]
    },
    SegregatedData: {
      name: "SegregatedData",
      description: "Allows organizing data into multiple sections with individual headers.",
      category: "data",
      properties: ["globalHeader", "sections", "footer", "meta", "globalStyle", "sectionContainerStyle"]
    },
    DataItemDescription: {
      name: "DataItemDescription",
      description: "Provides metadata about data fields for automatic UI generation.",
      category: "data",
      properties: ["key", "label", "typeOfField", "sortForParticularField", "filterForParticularField", "editableField"]
    },
    CardViewInstance: {
      name: "CardViewInstance",
      description: "The instance API returned when creating a card view, providing methods to control the view.",
      category: "core",
      properties: ["updateData", "updateConfig", "destroy", "getSelected", "filter", "sort", "refresh", "scrollToItem", "exportAs"]
    }
  };

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "default",
      securityLevel: "loose",
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
      },
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    });
    mermaid.contentLoaded();
  }, []);

  const handleInterfaceClick = (interfaceName: string) => {
    setActiveInterface(interfaceName);
    
    // Scroll to the info panel
    document.querySelector(".info-panel")?.scrollIntoView({ 
      behavior: "smooth",
      block: "start"
    });
  };

  const filteredInterfaces = Object.entries(interfaceInfo)
    .filter(([name, info]) => 
      name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      info.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="interfaces-map-container">
      <header className="interfaces-header">
        <h1>Card View Interfaces Relationship Map</h1>
        <p className="subtitle">
          Visualizing how all interfaces connect and interact in the Card View component
        </p>
      </header>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search interfaces..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="content-wrapper">
        {/* Diagram */}
        <div className="diagram-container">
          <div className="diagram-header">
            <h2>Interface Relationships</h2>
            <p>Click on any interface to see details</p>
          </div>
          <div className="mermaid-diagram">
            <div className="mermaid">
              {`classDiagram
              direction LR
              
              %% Core Interfaces
              class CardViewOptions {
                +string dataMode
                +DataItem[] data
                +DataItemDescription[] dataItemDescription
                +SegregatedData segregatedData
                +function renderCard
                +HeaderCardViewOptions headerCardView
                +CardContentConfig content
                +CardLayoutOptions layout
                +CardStyle cardStyle
                +CardInteractions interactions
                +DataOperations dataOperations
                +PaginationConfig pagination
                +ZoomConfig zoom
                +boolean virtualScroll
                +boolean lazyLoad
              }

              class DataItem {
                  +string id
                  +any [key]
              }

              class CardViewInstance {
                  +updateData()
                  +updateConfig()
                  +destroy()
                  +getSelected()
                  +filter()
                  +sort()
                  +refresh()
                  +scrollToItem()
                  +exportAs()
              }

              %% Interaction Interfaces
              class CardInteractions {
                  +boolean selectable
                  +boolean multiSelect
                  +function onSelect
                  +boolean draggable
                  +function onDragStart
                  +function onDragEnd
                  +function onClick
                  +function onDoubleClick
                  +function onHover
              }

              class CardSelectionOptions {
                  +boolean selectable
                  +boolean multiSelect
                  +function onSelect
              }

              class CardDragOptions {
                  +boolean draggable
                  +function onDragStart
                  +function onDragEnd
              }

              class CardClickOptions {
                  +function onClick
                  +function onDoubleClick
                  +function onHover
              }

              %% Layout Interfaces
              class CardLayoutOptions {
                  +string type
                  +number columns
                  +number|string gap
                  +number|string padding
                  +object gridOptions
                  +object masonryOptions
                  +object carouselOptions
                  +object stackOptions
                  +object breakpoints
                  +string className
                  +CSSProperties style
              }

              %% Data Operation Interfaces
              class DataOperations {
                  +SortConfig sort
                  +FilterConfig filter
                  +SearchConfig search
              }

              class SortConfig {
                  +boolean enabled
                  +boolean multiSort
                  +function compareFn
              }

              class FilterConfig {
                  +boolean enabled
                  +function filterFn
              }

              class SearchConfig {
                  +boolean enabled
                  +function searchFn
              }

              class PaginationConfig {
                  +boolean enabled
                  +number itemsPerPage
                  +string variant
              }

              class ZoomConfig {
                  +boolean enabled
                  +number maxScale
              }

              %% Content Configuration Interfaces
              class CardContentConfig {
                  +string contentDisplayType
                  +CardFieldConfig|CardTemplateConfig|CardDefaultView content
              }

              class CardFieldConfig {
                  +CardRow[] rows
                  +CSSProperties cardStyle
                  +string|number rowSpacing
                  +string flexDirection
                  +string flexWrap
              }

              class CardRow {
                  +string id
                  +CardSection left
                  +CardSection center
                  +CardSection right
                  +CSSProperties containerStyle
                  +boolean visible
                  +function onClick
              }

              class CardSection {
                  +CardElement[] elements
                  +CSSProperties style
                  +string justifyContent
                  +string flexDirection
                  +string|number gap
              }

              class CardElement {
                  +string id
                  +function component()
                  +string align
                  +CSSProperties style
                  +number order
              }

              class CardTemplateConfig {
                  +string template
                  +object helpers
              }

              class CardDefaultView {
                  +string[] excludeKeys
              }

              class CardStyle {
                  +string className
                  +CSSProperties style
              }

              %% Header Interfaces
              class HeaderCardViewOptions {
                  +object headerConfig
                  +ReactNode customHeader
                  +boolean visible
                  +CSSProperties style
                  +string title
                  +ReactNode[] additionalActions
              }

              %% Segregated Data Interfaces
              class SegregatedData {
                  +ReactNode|HeaderCardViewOptions globalHeader
                  +CardSection[] sections
                  +ReactNode|object footer
                  +object meta
                  +CSSProperties globalStyle
                  +CSSProperties sectionContainerStyle
              }

              class CardSection {
                  +string id
                  +string|ReactNode header
                  +HeaderCardViewOptions headerConfig
                  +object data
                  +CSSProperties style
                  +CardContentConfig content
                  +boolean collapsible
                  +boolean initiallyCollapsed
                  +CardInteractions interactions
              }

              %% Data Description Interface
              class DataItemDescription {
                  +string key
                  +string label
                  +string typeOfField
                  +object sortForParticularField
                  +object filterForParticularField
                  +object editableField
              }

              %% Relationship Definitions
              CardViewOptions --> DataItem : contains[]
              CardViewOptions --> CardInteractions : uses
              CardViewOptions --> CardLayoutOptions : uses
              CardViewOptions --> DataOperations : uses
              CardViewOptions --> CardContentConfig : uses
              CardViewOptions --> HeaderCardViewOptions : uses
              CardViewOptions --> SegregatedData : uses
              CardViewOptions --> DataItemDescription : uses

              CardInteractions --|> CardSelectionOptions : extends
              CardInteractions --|> CardDragOptions : extends
              CardInteractions --|> CardClickOptions : extends

              CardContentConfig --> CardFieldConfig : option
              CardContentConfig --> CardTemplateConfig : option
              CardContentConfig --> CardDefaultView : option

              CardFieldConfig --> CardRow : contains[]
              CardRow --> CardSection : has 3x
              CardSection --> CardElement : contains[]

              SegregatedData --> CardSection : contains[]
              CardSection --> HeaderCardViewOptions : uses
              CardSection --> CardContentConfig : uses
              CardSection --> CardInteractions : uses

              DataOperations --> SortConfig : uses
              DataOperations --> FilterConfig : uses
              DataOperations --> SearchConfig : uses
              `}
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="info-panel">
          <div className="info-panel-header">
            <h2>Interface Details</h2>
            <div className="category-badge">{interfaceInfo[activeInterface]?.category}</div>
          </div>
          
          <div className="interface-details">
            <h3 className="interface-name">{activeInterface}</h3>
            <p className="interface-description">
              {interfaceInfo[activeInterface]?.description}
            </p>
            
            {interfaceInfo[activeInterface]?.properties && (
              <div className="properties-section">
                <h4>Key Properties:</h4>
                <div className="properties-grid">
                  {interfaceInfo[activeInterface].properties?.map((prop, index) => (
                    <span key={index} className="property-tag">{prop}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="interfaces-list">
            <h4>All Interfaces</h4>
            <div className="interface-items">
              {filteredInterfaces.map(([name, info]) => (
                <div 
                  key={name} 
                  className={`interface-item ${activeInterface === name ? 'active' : ''}`}
                  onClick={() => handleInterfaceClick(name)}
                >
                  <div className="interface-item-header">
                    <h5>{name}</h5>
                    <div className={`category-indicator ${info.category}`} />
                  </div>
                  <p>{info.description.substring(0, 80)}...</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="legend">
        <h3>Interface Categories</h3>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color core" />
            <span>Core Interfaces</span>
          </div>
          <div className="legend-item">
            <div className="legend-color interaction" />
            <span>Interaction Interfaces</span>
          </div>
          <div className="legend-item">
            <div className="legend-color layout" />
            <span>Layout Interfaces</span>
          </div>
          <div className="legend-item">
            <div className="legend-color data" />
            <span>Data Operation Interfaces</span>
          </div>
          <div className="legend-item">
            <div className="legend-color ui" />
            <span>UI Configuration Interfaces</span>
          </div>
        </div>
      </div>

      <footer className="interfaces-footer">
        <p>
          Card View Interfaces Relationship Map | Designed for developers to
          understand interface connections
        </p>
      </footer>
    </div>
  );
};

export default CardViewInterfacesMap;