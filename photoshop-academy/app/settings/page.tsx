import type { Metadata } from "next";
import { SettingsContent } from "@/components/settings/SettingsContent";

export const metadata: Metadata = {
  title: "설정",
  description: "테마, 진도 관리, 데이터 가져오기와 내보내기",
};

export default function SettingsPage() {
  return <SettingsContent />;
}
