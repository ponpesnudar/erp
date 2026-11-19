import React, { useState } from 'react';
import { CheckCircle2, ChevronRight, Clock, AlertCircle, ArrowRight } from 'lucide-react';

export interface WorkflowNode {
  id: string;
  title: string;
  keterangan: string;
  count: number;
  icon: React.ElementType;
  status: 'selesai' | 'aktif' | 'menunggu';
}

interface ModuleWorkflowFlowchartProps {
  moduleName: string;
  alurTitle: string;
  nodes: WorkflowNode[];
  onSelectStage?: (nodeId: string) => void;
  pendingApprovals?: {
    id: string;
    judul: string;
    nominal?: number;
    waktu: string;
    pemohon: string;
  }[];
  ringkasanPanel?: {
    label: string;
    value: string | number;
    sub?: string;
  }[];
}

export const ModuleWorkflowFlowchart: React.FC<ModuleWorkflowFlowchartProps> = ({
  moduleName,
  alurTitle,
  nodes,
  onSelectStage,
  pendingApprovals = [],
  ringkasanPanel = [],
}) => {
  const [viewMode, setViewMode] = useState<'alur' | 'tabel'>('alur');
  const [selectedNode, setSelectedNode] = useState<string>(nodes[0]?.id || '');

  return (
    <div className="space-y-6">
      {/* Alur Header & View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>Alur {alurTitle}</span>
            <span className="text-xs font-normal text-slate-500">
              (Klik tahap untuk membuka daftar dokumen aktif)
            </span>
          </h3>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit self-start sm:self-auto border border-slate-200">
          <button
            onClick={() => setViewMode('alur')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              viewMode === 'alur' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Diagram Alur
          </button>
          <button
            onClick={() => setViewMode('tabel')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              viewMode === 'tabel' ? 'bg-white text-emerald-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tabel Tahapan
          </button>
        </div>
      </div>

      {/* Main Grid: Left Alur Diagram, Right Approvals & Summary (As seen in Lampiran C) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Alur Card */}
        <div className="lg:col-span-8 rounded-2xl bg-white border border-slate-200 p-5 shadow-2xs">
          {viewMode === 'alur' ? (
            <div className="space-y-4">
              {/* Desktop Horizontal Stepper with Connectors */}
              <div className="hidden sm:flex items-center justify-between gap-2 overflow-x-auto py-2">
                {nodes.map((node, idx) => {
                  const Icon = node.icon;
                  const isSelected = selectedNode === node.id;

                  return (
                    <React.Fragment key={node.id}>
                      <button
                        onClick={() => {
                          setSelectedNode(node.id);
                          onSelectStage?.(node.id);
                        }}
                        className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all min-w-[110px] max-w-[130px] shrink-0 ${
                          isSelected
                            ? 'bg-emerald-50/90 border-emerald-600 ring-2 ring-emerald-500/20'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 font-bold ${
                            node.status === 'selesai'
                              ? 'bg-emerald-100 text-emerald-800'
                              : node.status === 'aktif'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <p className="text-[11px] font-bold text-slate-900 leading-tight">
                          {node.title}
                        </p>
                        <span
                          className={`mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold tabular-nums ${
                            node.count > 0 ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {node.count} aktif
                        </span>
                        <p className="mt-1 text-[9px] text-slate-400 line-clamp-1">{node.keterangan}</p>
                      </button>

                      {idx < nodes.length - 1 && (
                        <div className="shrink-0 flex items-center justify-center text-slate-300">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Mobile Vertical Stepper */}
              <div className="flex sm:hidden flex-col space-y-3">
                {nodes.map((node, idx) => {
                  const Icon = node.icon;
                  return (
                    <button
                      key={node.id}
                      onClick={() => {
                        setSelectedNode(node.id);
                        onSelectStage?.(node.id);
                      }}
                      className={`flex items-center gap-3 p-3 rounded-xl border text-left transition ${
                        selectedNode === node.id
                          ? 'bg-emerald-50 border-emerald-600'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900">{node.title}</p>
                        <p className="text-[10px] text-slate-500">{node.keterangan}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-800 text-white">
                        {node.count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Klik salah satu tahap untuk melihat rincian dokumen yang sedang berlangsung.</span>
                <span className="font-semibold text-emerald-800">Alur Standar Pesantren</span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 text-left">
                    <th className="py-2">Tahap Alur</th>
                    <th className="py-2">Dokumen Aktif</th>
                    <th className="py-2">Keterangan</th>
                    <th className="py-2 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {nodes.map((n) => (
                    <tr key={n.id} className="hover:bg-slate-50">
                      <td className="py-2.5 font-bold text-slate-900">{n.title}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {n.count} berkas
                        </span>
                      </td>
                      <td className="py-2.5 text-slate-600">{n.keterangan}</td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => onSelectStage?.(n.id)}
                          className="text-xs font-semibold text-emerald-800 hover:underline"
                        >
                          Buka Daftar →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Panel: Menunggu Persetujuan Saya & Ringkasan (Lampiran C right panel) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Menunggu Persetujuan Card */}
          <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Menunggu Persetujuan Saya</span>
              </h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                {pendingApprovals.length}
              </span>
            </div>

            <div className="mt-3 space-y-2 max-h-56 overflow-y-auto">
              {pendingApprovals.length === 0 ? (
                <div className="py-4 text-center text-xs text-slate-400">
                  Tidak ada dokumen yang menunggu persetujuan Anda saat ini.
                </div>
              ) : (
                pendingApprovals.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-emerald-50/50 hover:border-emerald-300 transition text-left"
                  >
                    <p className="text-xs font-bold text-slate-900">{item.judul}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                      <span>Oleh: {item.pemohon}</span>
                      <span>{item.waktu}</span>
                    </div>
                    {item.nominal !== undefined && (
                      <p className="text-[11px] font-bold text-emerald-800 mt-1 tabular-nums">
                        Rp {item.nominal.toLocaleString('id-ID')}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Summary / Status Card */}
          {ringkasanPanel.length > 0 && (
            <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-2xs">
              <h4 className="font-bold text-xs text-slate-900 mb-3">Ringkasan Modul</h4>
              <div className="space-y-2">
                {ringkasanPanel.map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">{r.label}</span>
                    <div className="text-right">
                      <span className="font-bold text-slate-800 tabular-nums">{r.value}</span>
                      {r.sub && <p className="text-[10px] text-slate-400">{r.sub}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
