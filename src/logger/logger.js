import { format, transports, createLogger } from "winston";
import { getNamespace } from "cls-hooked";
import "winston-daily-rotate-file";

const fileRotateTransport = new transports.DailyRotateFile({
    filename: "./logs/logs-%DATE%.log",
    datePattern: "YYYY-MM-DD",
    maxFiles: "14d"
});

const formatMessage = (message) => {
    const log = {
        logger: "detailedLogger",
        requestId: getNamespace("currentRequest")?.active?.requestId,
        log: message
    };
    return log;
};

const winstonLogger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp(),
        format.json()
    ),
    transports: [fileRotateTransport],
});

export const logger = {
    info: function (message) {
        winstonLogger.info(formatMessage(message));
    },
    error: (message) => {
        winstonLogger.error(formatMessage(message));
    }
};