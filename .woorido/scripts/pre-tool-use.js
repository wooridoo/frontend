#!/usr/bin/env node

/**
 * WooriDo Skills - Pre Tool Use Hook
 * 
 * 코드 수정 전 도메인 규칙을 검증합니다.
 * - 금융 관련 코드 변경 시 fintech_rules.md 경고
 * - 당도(Brix) 계산 로직 변경 시 검증
 * - 보증금(Deposit) 관련 코드 락 규칙 확인
 */

const fs = require('fs');
const path = require('path');

// 금융 관련 키워드
const FINTECH_KEYWORDS = [
  'money', 'pay', 'payment', 'settle', 'settlement',
  'deposit', 'withdraw', 'transfer', 'transaction',
  'wallet', 'ledger', 'refund',
  '정산', '결제', '보증금', '출금', '입금', '송금', '장부', '환급'
];

// 당도(Brix) 관련 키워드
const BRIX_KEYWORDS = [
  'brix', 'sweetness', 'trust', 'score',
  '당도', '신뢰도', '점수'
];

// 동시성 제어 관련 키워드
const CONCURRENCY_KEYWORDS = [
  'lock', 'synchronized', 'transaction', 'atomic',
  'select for update', 'pessimistic', 'optimistic',
  '락', '동시성', '격리'
];

/**
 * 입력 파싱 (tool_input JSON)
 */
function parseInput() {
  try {
    // 환경변수 또는 stdin에서 입력 받기
    const input = process.env.TOOL_INPUT || '';
    return JSON.parse(input || '{}');
  } catch {
    return {};
  }
}

/**
 * 키워드 매칭 검사
 */
function matchKeywords(content, keywords) {
  const lowerContent = content.toLowerCase();
  return keywords.filter(kw => lowerContent.includes(kw.toLowerCase()));
}

/**
 * 경고 생성
 */
function generateWarnings(filePath, content, toolName) {
  const warnings = [];

  // 금융 관련 코드 검사
  const fintechMatches = matchKeywords(content, FINTECH_KEYWORDS);
  if (fintechMatches.length > 0) {
    warnings.push({
      type: 'FINTECH',
      severity: 'high',
      message: `💰 금융 관련 코드 수정 감지: [${fintechMatches.join(', ')}]`,
      rule: 'docs/00_CANONICAL/03_FINANCIAL_MODEL.md 또는 .woorido/references/active/03-financial-model.md 참조 필수',
      checklist: [
        'append-only 원장 사용 여부',
        'idempotency key 또는 동등한 중복 방지 확인',
        'projection과 원장 분리 여부 확인',
        '트랜잭션 경계와 롤백 처리 확인'
      ]
    });
  }

  // 당도(Brix) 관련 코드 검사
  const brixMatches = matchKeywords(content, BRIX_KEYWORDS);
  if (brixMatches.length > 0) {
    warnings.push({
      type: 'BRIX',
      severity: 'medium',
      message: `🍊 당도 시스템 관련 코드 수정 감지: [${brixMatches.join(', ')}]`,
      rule: '.woorido/references/active/06-brix.md 또는 프로젝트 canonical 문서 참조 필수',
      formula: '당도 = 납입당도(0.7) + 활동당도(0.15) + 기본값(12), 상한 80'
    });
  }

  // 동시성 제어 코드 검사
  const concurrencyMatches = matchKeywords(content, CONCURRENCY_KEYWORDS);
  if (concurrencyMatches.length > 0) {
    warnings.push({
      type: 'CONCURRENCY',
      severity: 'high',
      message: `🔒 동시성 제어 코드 수정 감지: [${concurrencyMatches.join(', ')}]`,
      rule: 'active transaction boundary + locking strategy 확인',
      checklist: [
        'DB 격리 수준 확인',
        '데드락 가능성 검토',
        '타임아웃 설정 확인'
      ]
    });
  }

  return warnings;
}

/**
 * 메인 실행
 */
function main() {
  const input = parseInput();
  const { tool_name, file_path, content } = input;

  // Edit/Write 도구가 아니면 패스
  if (!['Edit', 'Write', 'MultiEdit'].includes(tool_name)) {
    console.log(JSON.stringify({
      status: 'pass',
      message: 'Non-edit tool, skipping validation.'
    }));
    return;
  }

  // 파일 경로나 내용이 없으면 패스
  if (!file_path && !content) {
    console.log(JSON.stringify({
      status: 'pass',
      message: 'No content to validate.'
    }));
    return;
  }

  const contentToCheck = content || '';
  const warnings = generateWarnings(file_path, contentToCheck, tool_name);

  if (warnings.length === 0) {
    console.log(JSON.stringify({
      status: 'pass',
      message: '✅ 도메인 규칙 검증 통과'
    }));
  } else {
    console.log(JSON.stringify({
      status: 'warn',
      warnings: warnings,
      message: `⚠️ ${warnings.length}개의 도메인 규칙 확인 필요`,
      action: 'proceed_with_caution'
    }));
  }
}

main();
