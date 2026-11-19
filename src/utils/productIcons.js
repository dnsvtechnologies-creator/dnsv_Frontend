import {
  Mail,
  ShieldCheck,
  Package,
  Cpu,
  Database,
  Globe,
  Terminal,
  BarChart3,
  Send,
  Users,
  Clock,
  Layers,
  Server,
  FileSpreadsheet,
  Code2,
  Wrench,
  Settings,
  Zap
} from 'lucide-react';

const ICON_MAP = {
  mail: Mail,
  shieldCheck: ShieldCheck,
  package: Package,
  cpu: Cpu,
  database: Database,
  globe: Globe,
  terminal: Terminal,
  barChart: BarChart3,
  send: Send,
  users: Users,
  clock: Clock,
  layers: Layers,
  server: Server,
  fileSpreadsheet: FileSpreadsheet,
  code2: Code2,
  wrench: Wrench,
  settings: Settings,
  zap: Zap
};

export function getProductIcon(iconKey, fallback = Package) {
  return ICON_MAP[iconKey] || fallback;
}
