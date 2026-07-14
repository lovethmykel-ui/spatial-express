import React, { useState } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker
} from 'react-simple-maps'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { cn } from '../lib/utils'

// TopoJSON map for the world
const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json"

interface InteractiveMapProps {
  className?: string
  markers?: Array<{ name: string; coordinates: [number, number]; id: string }>
  onCountryClick?: (geo: any) => void
}

export function InteractiveMap({ className, markers = [], onCountryClick }: InteractiveMapProps) {
  const [tooltipContent, setTooltipContent] = useState("")

  return (
    <div className={cn("relative w-full h-full bg-[#050608] rounded-2xl overflow-hidden border border-white/5 shadow-[inset_0_2px_20px_rgba(0,0,0,0.5)] grid-bg", className)}>
      <ComposableMap
        projectionConfig={{ scale: 140 }}
        className="w-full h-full"
      >
        <ZoomableGroup zoom={1} center={[0, 20]} minZoom={1} maxZoom={5}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => {
                    setTooltipContent(geo.properties.name)
                  }}
                  onMouseLeave={() => {
                    setTooltipContent("")
                  }}
                  onClick={() => onCountryClick?.(geo)}
                  style={{
                    default: {
                      fill: "rgba(255, 255, 255, 0.05)",
                      stroke: "rgba(255, 255, 255, 0.1)",
                      strokeWidth: 0.5,
                      outline: "none",
                    },
                    hover: {
                      fill: "rgba(57, 255, 20, 0.2)",
                      stroke: "#39FF14",
                      strokeWidth: 1,
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: "rgba(57, 255, 20, 0.4)",
                      outline: "none",
                    },
                  }}
                />
              ))
            }
          </Geographies>
          
          {markers.map(({ name, coordinates, id }) => (
            <Marker key={id} coordinates={coordinates}>
              <g
                fill="none"
                stroke="#39FF14"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(-12, -24)"
              >
                <circle cx="12" cy="10" r="3" />
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" />
              </g>
              <text
                textAnchor="middle"
                y={15}
                style={{ fontFamily: "Inter, sans-serif", fill: "#fff", fontSize: "10px", fontWeight: "bold" }}
              >
                {name}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
      
      <Tooltip id="my-tooltip" className="bg-[#0D1117] text-white text-xs font-bold border border-white/10 rounded-lg shadow-xl" />
      {tooltipContent && (
        <div 
          data-tooltip-id="my-tooltip" 
          data-tooltip-content={tooltipContent}
          className="absolute inset-0 pointer-events-none"
        />
      )}
    </div>
  )
}
