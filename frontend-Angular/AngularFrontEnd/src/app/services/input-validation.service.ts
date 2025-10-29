import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class InputValidationService {
    private dangerousPatterns: { pattern: RegExp; description: string }[] = [
        // Patrones de HTML/JavaScript
        { pattern: /<\/?script[^>]*>/i, description: 'etiquetas de script' },
        { pattern: /on\w+\s*=\s*['"][^'"]*['"]/i, description: 'manejadores de eventos inline' },
        { pattern: /javascript:\s*/i, description: 'enlaces javascript' },
        { pattern: /data:\s*text\/html/i, description: 'enlaces de datos HTML' },
        { pattern: /<[^>]*>/i, description: 'etiquetas HTML' },
         
        // Patrones de inyección SQL - Comandos DDL (Data Definition Language)
        { pattern: /\b(create|alter|drop|truncate)\s+(table|database|index|view|procedure|function|trigger)\b/i, description: 'comandos DDL de SQL' },
        { pattern: /\b(drop|delete)\s+(table|database|index|view|procedure|function|trigger)\b/i, description: 'comandos destructivos de SQL' },
        
        // Patrones de inyección SQL - Comandos DML (Data Manipulation Language)
        { pattern: /\b(select|insert|update|delete|merge)\s+.*\bfrom\b/i, description: 'comandos DML de SQL' },
        { pattern: /\b(select|insert|update|delete)\s+.*\bwhere\b/i, description: 'comandos DML con WHERE' },
        
        // Patrones de inyección SQL - Operadores y funciones
        { pattern: /\b(union|union\s+all)\s+select/i, description: 'inyección UNION en SQL' },
        { pattern: /\b(and|or)\s+\d+\s*=\s*\d+/i, description: 'operadores lógicos SQL' },
        { pattern: /\b(and|or)\s+['"]\s*=\s*['"]/i, description: 'operadores lógicos con strings SQL' },
        { pattern: /\b(and|or)\s+1\s*=\s*1/i, description: 'condiciones siempre verdaderas SQL' },
        { pattern: /\b(and|or)\s+0\s*=\s*1/i, description: 'condiciones siempre falsas SQL' },
        
        // Patrones de inyección SQL - Funciones y procedimientos
        { pattern: /\b(exec|execute|sp_|xp_)\w*/i, description: 'ejecución de procedimientos SQL' },
        { pattern: /\b(load_file|into\s+outfile|into\s+dumpfile)\b/i, description: 'operaciones de archivos SQL' },
        { pattern: /\b(concat|substring|ascii|char|length)\s*\(/i, description: 'funciones de manipulación SQL' },
        
        // Patrones de inyección SQL - Comentarios y delimitadores
        { pattern: /(--|#|\/\*|\*\/)/, description: 'comentarios de código SQL' },
        { pattern: /;\s*$/, description: 'delimitador de comandos SQL' },
        
        // Patrones de inyección SQL - Inyección de tiempo
        { pattern: /\b(sleep|waitfor|benchmark)\s*\(/i, description: 'comandos de tiempo SQL' },
        
        // Patrones de inyección SQL - Información del sistema
        { pattern: /\b(version|user|database|schema|table_name|column_name)\b/i, description: 'información del sistema SQL' },
        { pattern: /\b(information_schema|mysql\.|sys\.|pg_)/i, description: 'tablas del sistema SQL' },
        
        // Patrones de comandos del sistema operativo
        { pattern: /\b(rm|del|format|shutdown|reboot|halt|poweroff)\b/i, description: 'comandos destructivos del sistema' },
        { pattern: /\b(cat|type|more|less|head|tail|grep|find|ls|dir)\s+/i, description: 'comandos de lectura del sistema' },
        { pattern: /\b(wget|curl|nc|netcat|telnet|ssh|ftp)\b/i, description: 'comandos de red' },
        { pattern: /\b(ping|traceroute|nslookup|dig)\b/i, description: 'comandos de diagnóstico de red' },
        { pattern: /\b(chmod|chown|chgrp|umask)\s+/i, description: 'comandos de permisos del sistema' },
        { pattern: /\b(kill|killall|pkill|taskkill)\s+/i, description: 'comandos de terminación de procesos' },
        { pattern: /\b(sudo|su|runas)\s+/i, description: 'comandos de elevación de privilegios' },
        
        // Patrones de inyección de comandos
        { pattern: /\|\s*[a-zA-Z]/, description: 'pipe de comandos' },
        { pattern: /&&\s*[a-zA-Z]/, description: 'operador AND de comandos' },
        { pattern: /\|\|\s*[a-zA-Z]/, description: 'operador OR de comandos' },
        { pattern: /`[^`]*`/, description: 'ejecución de comandos con backticks' },
        { pattern: /\$\([^)]*\)/, description: 'sustitución de comandos' },
        
        // Patrones de inyección de archivos
        { pattern: /\.\.\//, description: 'trayectoria relativa (directory traversal)' },
        { pattern: /\.\.\\/, description: 'trayectoria relativa Windows' },
        { pattern: /\b(etc\/passwd|etc\/shadow|windows\/system32)/i, description: 'archivos sensibles del sistema' },
        
        // Patrones de inyección de código
        { pattern: /\b(eval|exec|compile|__import__)\s*\(/i, description: 'funciones de ejecución de código' },
        { pattern: /\b(import|from)\s+\w+/, description: 'importaciones de módulos' },
        { pattern: /\b(require|include|include_once|require_once)\s*\(/i, description: 'inclusiones de archivos' },
        
        // Patrones de inyección de variables
        { pattern: /\$\{[^}]*\}/, description: 'interpolación de variables' },
        { pattern: /\$\w+/, description: 'variables del sistema' },
        { pattern: /%[^%]*%/, description: 'variables de entorno Windows' },
        
        // Patrones de inyección de URLs y protocolos
        { pattern: /(http|https|ftp|file|data):\/\//i, description: 'protocolos de red' },
        { pattern: /\b(localhost|127\.0\.0\.1|0\.0\.0\.0)\b/, description: 'direcciones de red locales' },
        
        // Patrones de inyección de caracteres especiales
        { pattern: /[<>{}[\]\\|`~!#$%^&*=]/g, description: 'símbolos especiales no permitidos' },
        { pattern: /[\x00-\x1f\x7f-\x9f]/, description: 'caracteres de control' }
    ];

    sanitize(input: unknown): string {
        const value = String(input ?? '').trim();
        // Remove HTML tags except allow basic safe characters
        const noTags = value.replace(/<[^>]*>/g, '');
        // Collapse multiple spaces
        const collapsed = noTags.replace(/\s{2,}/g, ' ');
        // Remove common SQL comment tokens
        const withoutSqlComments = collapsed.replace(/(--|#).*/g, '');
        return withoutSqlComments;
    }

    hasDangerousContent(value: string): boolean {
        if (!value) return false;
        return this.dangerousPatterns.some((item) => item.pattern.test(value));
    }

    getDangerousContentDescription(value: string): string | null {
        if (!value) return null;
        
        const dangerousItem = this.dangerousPatterns.find((item) => item.pattern.test(value));
        return dangerousItem ? dangerousItem.description : null;
    }

    validateInput(value: string): { isValid: boolean; errorMessage?: string } {
        if (!value) return { isValid: true };
        
        const dangerousDescription = this.getDangerousContentDescription(value);
        if (dangerousDescription) {
            return {
                isValid: false,
                errorMessage: `El campo contiene ${dangerousDescription}. Por favor, ingresa solo texto válido.`
            };
        }
        
        return { isValid: true };
    }
}

export function forbidDangerousContent(service: InputValidationService): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = String(control.value ?? '');
        if (!value) return null;
        
        const validation = service.validateInput(value);
        if (!validation.isValid) {
            return { 
                dangerousContent: true,
                message: validation.errorMessage || 'Hay campos que tienen símbolos o contenido malicioso'
            };
        }
        
        return null;
    };
}


