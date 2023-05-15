import { DateTime } from "luxon";

export default class UtilDateTime {
    public static age(birthDay: DateTime): number {
        const now = DateTime.now().startOf("day");
        const diffInYears = now.diff(birthDay, "years");
        return Math.floor(diffInYears.as("years"));
    }

    public static japaneseDateStyle(dateTime: DateTime): string {
        // 令和
        const reiwaStartDate = DateTime.fromISO("2019-05-01");
        if (dateTime >= reiwaStartDate) {
            const diffInYears = dateTime.diff(reiwaStartDate, ["years"]);
            const reiwaYear = Math.floor(diffInYears.as("years")) + 1;
            return `令和${reiwaYear}年${dateTime.toFormat("TT")}`;
        }

        // 平成
        const heiseiStartDate = DateTime.fromISO("1989-01-08");
        if (dateTime >= heiseiStartDate) {
            const diffInYears = dateTime.diff(heiseiStartDate, ["years"]);
            const heiseiYear = Math.floor(diffInYears.as("years")) + 1;
            return `平成${heiseiYear}年${dateTime.toFormat("MM月dd日")}`;
        }

        // 昭和
        const showaStartDate = DateTime.fromISO("1926-12-25");
        if (dateTime >= showaStartDate) {
            const diffInYears = dateTime.diff(showaStartDate, ["years"]);
            const showaYear = Math.floor(diffInYears.as("years")) + 1;
            return `昭和${showaYear}年${dateTime.toFormat("MM月dd日")}`;
        }

        // 大正
        const taishoStartDate = DateTime.fromISO("1912-07-30");
        if (dateTime >= taishoStartDate) {
            const diffInYears = dateTime.diff(taishoStartDate, ["years"]);
            const taishoYear = Math.floor(diffInYears.as("years")) + 1;
            return `大正${taishoYear}年${dateTime.toFormat("MM月dd日")}`;
        }

        // 明治
        const meijiStartDate = DateTime.fromISO("1868-01-25");
        if (dateTime >= meijiStartDate) {
            const diffInYears = dateTime.diff(meijiStartDate, ["years"]);
            const meijiYear = Math.floor(diffInYears.as("years")) + 1;
            return `明治${meijiYear}年${dateTime.toFormat("MM月dd日")}`;
        }

        // それより前
        return dateTime.toFormat("D TT");
    }
}
