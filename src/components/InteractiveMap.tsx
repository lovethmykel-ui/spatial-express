import React, { useState } from 'react'
import {
  ComposableMap as ComposableMapRaw,
  Geographies as GeographiesRaw,
  Geography as GeographyRaw,
  ZoomableGroup as ZoomableGroupRaw,
  Marker as MarkerRaw
} from 'react-simple-maps'
import { Tooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import { cn } from '../lib/utils'

const ComposableMap = ComposableMapRaw as any
const Geographies = GeographiesRaw as any
const Geography = GeographyRaw as any
const ZoomableGroup = ZoomableGroupRaw as any
const Marker = MarkerRaw as any

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
    <div className={cn("relative w-full h-full bg-slate-50/80 rounded-2xl overflow-hidden border border-slate-200 shadow-inner grid-bg", className)}>
      <ComposableMap
        projectionConfig={{ scale: 140 }}
        className="w-full h-full"
      >
        <ZoomableGroup zoom={1} center={[0, 20]} minZoom={1} maxZoom={5}>
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: any[] }) =>
              geographies.map((geo: any) => (
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
                      fill: "#E2E8F0",
                      stroke: "#CBD5E1",
                      strokeWidth: 0.6,
                      outline: "none",
                    },
                    hover: {
                      fill: "rgba(22, 163, 74, 0.2)",
                      stroke: "#16a34a",
                      strokeWidth: 1.2,
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: "rgba(22, 163, 74, 0.35)",
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
                stroke="#16a34a"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(-12, -24)"
              >
                <circle cx="12" cy="10" r="3" fill="#16a34a" />
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 7 8 11.7z" fill="white" />
              </g>
              <text
                textAnchor="middle"
                y={15}
                style={{ fontFamily: "Inter, sans-serif", fill: "#0f172a", fontSize: "10px", fontWeight: "bold" }}
              >
                {name}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
      
      <Tooltip id="my-tooltip" className="!bg-white !text-slate-900 text-xs font-bold !border !border-slate-200 !rounded-lg !shadow-lg" />
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
