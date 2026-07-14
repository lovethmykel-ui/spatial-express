import React from 'react'
import * as LucideIcons from 'lucide-react'
import { cn } from '../../lib/utils'

interface IconProps extends LucideIcons.LucideProps {
  className?: string
}

// Wrapper to enforce Spatial Express standard icon styling: 1.5px stroke, rounded caps.
const withPremiumStyle = (Icon: React.ElementType) => {
  return ({ className, strokeWidth = 1.5, size = 24, ...props }: IconProps) => (
    <Icon
      size={size}
      strokeWidth={strokeWidth}
      className={cn("transition-all duration-300", className)}
      {...props}
    />
  )
}

// ───────────────────────
// Core Navigation & UI
// ───────────────────────
export const MenuIcon = withPremiumStyle(LucideIcons.Menu)
export const XIcon = withPremiumStyle(LucideIcons.X)
export const ChevronDownIcon = withPremiumStyle(LucideIcons.ChevronDown)
export const ChevronRightIcon = withPremiumStyle(LucideIcons.ChevronRight)
export const ArrowRightIcon = withPremiumStyle(LucideIcons.ArrowRight)
export const ArrowLeftIcon = withPremiumStyle(LucideIcons.ArrowLeft)
export const SearchIcon = withPremiumStyle(LucideIcons.Search)

// ───────────────────────
// Logistics & Shipping
// ───────────────────────
export const TruckIcon = withPremiumStyle(LucideIcons.Truck)
export const PackageIcon = withPremiumStyle(LucideIcons.Package)
export const MapPinIcon = withPremiumStyle(LucideIcons.MapPin)
export const GlobeIcon = withPremiumStyle(LucideIcons.Globe)
export const Globe2Icon = withPremiumStyle(LucideIcons.Globe2)
export const Navigation2Icon = withPremiumStyle(LucideIcons.Navigation2)

// ───────────────────────
// Status & Verification
// ───────────────────────
export const CheckIcon = withPremiumStyle(LucideIcons.Check)
export const CheckCircleIcon = withPremiumStyle(LucideIcons.CheckCircle)
export const CheckCircle2Icon = withPremiumStyle(LucideIcons.CheckCircle2)
export const ShieldIcon = withPremiumStyle(LucideIcons.Shield)
export const ShieldCheckIcon = withPremiumStyle(LucideIcons.ShieldCheck)
export const ShieldAlertIcon = withPremiumStyle(LucideIcons.ShieldAlert)
export const AlertTriangleIcon = withPremiumStyle(LucideIcons.AlertTriangle)
export const InfoIcon = withPremiumStyle(LucideIcons.Info)
export const HelpCircleIcon = withPremiumStyle(LucideIcons.HelpCircle)

// ───────────────────────
// Data & Account
// ───────────────────────
export const UserIcon = withPremiumStyle(LucideIcons.User)
export const HistoryIcon = withPremiumStyle(LucideIcons.History)
export const ClockIcon = withPremiumStyle(LucideIcons.Clock)
export const FileTextIcon = withPremiumStyle(LucideIcons.FileText)
export const CalculatorIcon = withPremiumStyle(LucideIcons.Calculator)
export const CalendarIcon = withPremiumStyle(LucideIcons.Calendar)
export const BellIcon = withPremiumStyle(LucideIcons.Bell)

// ───────────────────────
// Actions & Misc
// ───────────────────────
export const UploadIcon = withPremiumStyle(LucideIcons.Upload)
export const DownloadIcon = withPremiumStyle(LucideIcons.Download)
export const TrashIcon = withPremiumStyle(LucideIcons.Trash)
export const PrinterIcon = withPremiumStyle(LucideIcons.Printer)
export const PlusIcon = withPremiumStyle(LucideIcons.Plus)
export const RotateCcwIcon = withPremiumStyle(LucideIcons.RotateCcw)
export const ZapIcon = withPremiumStyle(LucideIcons.Zap)
export const StarIcon = withPremiumStyle(LucideIcons.Star)
export const SendIcon = withPremiumStyle(LucideIcons.Send)

// ───────────────────────
// Contacts & Social
// ───────────────────────
export const PhoneIcon = withPremiumStyle(LucideIcons.Phone)
export const MailIcon = withPremiumStyle(LucideIcons.Mail)
export const MessageCircleIcon = withPremiumStyle(LucideIcons.MessageCircle)
export const MessageSquareIcon = withPremiumStyle(LucideIcons.MessageSquare)

// ───────────────────────
// Branding & Specific
// ───────────────────────
export const TargetIcon = withPremiumStyle(LucideIcons.Target)
export const CompassIcon = withPremiumStyle(LucideIcons.Compass)
export const BuildingIcon = withPremiumStyle(LucideIcons.Building)
export const AnchorIcon = withPremiumStyle(LucideIcons.Anchor)
export const AwardIcon = withPremiumStyle(LucideIcons.Award)
export const InboxIcon = withPremiumStyle(LucideIcons.Inbox)
export const HardHatIcon = withPremiumStyle(LucideIcons.HardHat)
export const LayoutDashboardIcon = withPremiumStyle(LucideIcons.LayoutDashboard)
export const ShirtIcon = withPremiumStyle(LucideIcons.Shirt)
export const LaptopIcon = withPremiumStyle(LucideIcons.Laptop)
export const PillIcon = withPremiumStyle(LucideIcons.Pill)
export const UtensilsIcon = withPremiumStyle(LucideIcons.Utensils)
export const BriefcaseIcon = withPremiumStyle(LucideIcons.Briefcase)
export const BookIcon = withPremiumStyle(LucideIcons.Book)
export const SparklesIcon = withPremiumStyle(LucideIcons.Sparkles)

// ───────────────────────
// Dashboard & Admin
// ───────────────────────
export const DollarSignIcon = withPremiumStyle(LucideIcons.DollarSign)
export const TrendingUpIcon = withPremiumStyle(LucideIcons.TrendingUp)
export const ActivityIcon = withPremiumStyle(LucideIcons.Activity)
export const SettingsIcon = withPremiumStyle(LucideIcons.Settings)
export const SlidersIcon = withPremiumStyle(LucideIcons.Sliders)
export const Undo2Icon = withPremiumStyle(LucideIcons.Undo2)
export const Redo2Icon = withPremiumStyle(LucideIcons.Redo2)
export const RefreshCwIcon = withPremiumStyle(LucideIcons.RefreshCw)
export const Edit2Icon = withPremiumStyle(LucideIcons.Edit2)
export const NetworkIcon = withPremiumStyle(LucideIcons.Network)
export const LayersIcon = withPremiumStyle(LucideIcons.Layers)
export const LogOutIcon = withPremiumStyle(LucideIcons.LogOut)
export const UsersIcon = withPremiumStyle(LucideIcons.Users)
export const CreditCardIcon = withPremiumStyle(LucideIcons.CreditCard)
