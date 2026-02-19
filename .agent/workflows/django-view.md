---
description: Create Django REST Framework ViewSet and Serializer
---

# /django-view [ResourceName]

<!-- Django REST Framework ViewSet 및 Serializer 생성 -->

## Usage
```
/django-view Recommendation
/django-view Search --elasticsearch
/django-view Analytics --readonly
```

## Steps

// turbo
1. Create Serializer `[app]/serializers.py`:

```python
# serializers.py
from rest_framework import serializers
from .models import [Resource]


class [Resource]Serializer(serializers.ModelSerializer):
    """
    [Resource] 모델 시리얼라이저
    """
    class Meta:
        model = [Resource]
        fields = ['id', 'title', 'description', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class [Resource]DetailSerializer([Resource]Serializer):
    """
    상세 조회용 시리얼라이저 (관계 포함)
    """
    # related_items = RelatedSerializer(many=True, read_only=True)
    
    class Meta([Resource]Serializer.Meta):
        fields = [Resource]Serializer.Meta.fields + ['related_items']
```

// turbo
2. Create ViewSet `[app]/views.py`:

```python
# views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import [Resource]
from .serializers import [Resource]Serializer, [Resource]DetailSerializer


class [Resource]ViewSet(viewsets.ModelViewSet):
    """
    [Resource] CRUD API
    """
    queryset = [Resource].objects.all()
    serializer_class = [Resource]Serializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return [Resource]DetailSerializer
        return [Resource]Serializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # 필터링
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return queryset.order_by('-created_at')
    
    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        통계 API
        """
        total = self.get_queryset().count()
        return Response({'total': total})
    
    @action(detail=True, methods=['post'])
    def custom_action(self, request, pk=None):
        """
        커스텀 액션 예시
        """
        instance = self.get_object()
        # 로직 수행
        return Response({'status': 'success'})
```

// turbo
3. Register URL `[app]/urls.py`:

```python
# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import [Resource]ViewSet

router = DefaultRouter()
router.register(r'[resources]', [Resource]ViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
```

## Elasticsearch Integration (--elasticsearch flag)

```python
# search/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from elasticsearch import Elasticsearch

es = Elasticsearch(['http://elasticsearch:9200'])


class [Resource]SearchView(APIView):
    """
    Elasticsearch 기반 검색 API
    """
    
    def get(self, request):
        query = request.query_params.get('q', '')
        
        if not query:
            return Response({'results': []})
        
        # Elasticsearch 쿼리
        search_body = {
            'query': {
                'multi_match': {
                    'query': query,
                    'fields': ['title^3', 'description'],
                    'analyzer': 'korean'
                }
            },
            'size': 20
        }
        
        result = es.search(index='[resources]', body=search_body)
        
        hits = [
            {
                'id': hit['_id'],
                'score': hit['_score'],
                **hit['_source']
            }
            for hit in result['hits']['hits']
        ]
        
        return Response({
            'total': result['hits']['total']['value'],
            'results': hits
        })
```

## Django Model Pattern

```python
# models.py
from django.db import models
import uuid


class [Resource](models.Model):
    """
    [Resource] 모델 - Spring Boot에서 동기화됨
    """
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, default='ACTIVE')
    synced_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True)  # Soft Delete
    
    class Meta:
        db_table = 'sync_[resources]'
        ordering = ['-created_at']
    
    @property
    def is_deleted(self) -> bool:
        return self.deleted_at is not None
```

---

## Pydantic DTO Pattern (타입 검증)

<!-- Pydantic을 활용한 타입 안전 DTO 패턴 -->

```python
# schemas/[resource]_schema.py
from pydantic import BaseModel, Field, validator
from datetime import datetime
from typing import Optional
from decimal import Decimal


class [Resource]Base(BaseModel):
    """Base DTO for [Resource]"""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    
    class Config:
        from_attributes = True  # Pydantic v2 (orm_mode in v1)


class Create[Resource]Request([Resource]Base):
    """Request DTO for creating [Resource]"""
    amount: Decimal = Field(..., gt=0)
    
    @validator('amount')
    def validate_amount(cls, v):
        if v <= 0:
            raise ValueError('Amount must be positive')
        return v


class [Resource]Response([Resource]Base):
    """Response DTO for [Resource]"""
    id: str
    amount: Decimal
    status: str
    created_at: datetime
    
    @classmethod
    def from_orm(cls, entity) -> '[Resource]Response':
        return cls(
            id=entity.id,
            title=entity.title,
            description=entity.description,
            amount=entity.amount,
            status=entity.status,
            created_at=entity.created_at
        )


class AnalysisRequest(BaseModel):
    """Request DTO for Analysis API"""
    challenge_id: str
    start_date: datetime
    end_date: datetime
    metrics: list[str] = Field(default=['brix', 'trend'])
```

**장점**: 타입 검증 자동화, Mock 테스트 용이, FastAPI 호환

---

## Strategy Pattern (분석 알고리즘)

<!-- 런타임 알고리즘 선택 - 분석, 카테고리별 검색, 추천 -->

```python
# strategies/analysis_strategy.py
from abc import ABC, abstractmethod
from typing import Dict, Any
import pandas as pd


class AnalysisStrategy(ABC):
    """분석 전략 인터페이스"""
    
    @abstractmethod
    def analyze(self, data: pd.DataFrame) -> Dict[str, Any]:
        pass
    
    @property
    @abstractmethod
    def strategy_type(self) -> str:
        pass


class BrixAnalysisStrategy(AnalysisStrategy):
    """당도(Brix) 분석 전략"""
    
    def analyze(self, data: pd.DataFrame) -> Dict[str, Any]:
        # Brix 계산 로직
        total_support = data['support_amount'].sum()
        total_benefit = data['benefit_amount'].sum()
        brix = (total_support / total_benefit * 100) if total_benefit > 0 else 0
        
        return {
            'brix_score': round(brix, 2),
            'level': self._get_level(brix),
            'emoji': self._get_emoji(brix)
        }
    
    def _get_level(self, brix: float) -> str:
        if brix >= 60: return 'HONEY'
        if brix >= 40: return 'GRAPE'
        if brix >= 25: return 'APPLE'
        if brix >= 12: return 'MANDARIN'
        if brix >= 0: return 'TOMATO'
        return 'BITTER'
    
    def _get_emoji(self, brix: float) -> str:
        levels = {60: '🍯', 40: '🍇', 25: '🍎', 12: '🍊', 0: '🍅'}
        for threshold, emoji in sorted(levels.items(), reverse=True):
            if brix >= threshold:
                return emoji
        return '🥒'
    
    @property
    def strategy_type(self) -> str:
        return 'brix'


class TrendAnalysisStrategy(AnalysisStrategy):
    """트렌드 분석 전략"""
    
    def analyze(self, data: pd.DataFrame) -> Dict[str, Any]:
        # 월별 트렌드 계산
        monthly = data.groupby(data['created_at'].dt.to_period('M'))['amount'].sum()
        trend = 'UP' if monthly.pct_change().mean() > 0 else 'DOWN'
        
        return {
            'trend': trend,
            'monthly_data': monthly.to_dict(),
            'growth_rate': round(monthly.pct_change().mean() * 100, 2)
        }
    
    @property
    def strategy_type(self) -> str:
        return 'trend'


# services/analysis_service.py
class AnalysisService:
    """분석 서비스 (Strategy Context)"""
    
    def __init__(self):
        self._strategies: Dict[str, AnalysisStrategy] = {
            'brix': BrixAnalysisStrategy(),
            'trend': TrendAnalysisStrategy(),
        }
    
    def analyze(self, strategy_type: str, data: pd.DataFrame) -> Dict[str, Any]:
        strategy = self._strategies.get(strategy_type)
        if not strategy:
            raise ValueError(f"Unknown strategy: {strategy_type}")
        return strategy.analyze(data)
    
    def register_strategy(self, strategy: AnalysisStrategy):
        self._strategies[strategy.strategy_type] = strategy
```

**적용 범위**: 분석 (Brix/Trend/Recommendation), 검색 (키워드/카테고리), A/B 테스트

---

## Visitor Pattern (리포트 생성)

<!-- 객체 구조 변경 없이 새 연산 추가 - 리포트 형식별 처리 -->

```python
# visitor/report_visitor.py
from abc import ABC, abstractmethod
from typing import Dict, Any
import json
import pandas as pd
from io import BytesIO


class ReportData:
    """리포트 데이터 (Element)"""
    def __init__(self, title: str, data: Dict[str, Any], chart_data: pd.DataFrame):
        self.title = title
        self.data = data
        self.chart_data = chart_data
    
    def accept(self, visitor: 'ReportVisitor') -> Any:
        return visitor.visit(self)


class ReportVisitor(ABC):
    """리포트 Visitor 인터페이스"""
    
    @abstractmethod
    def visit(self, report: ReportData) -> Any:
        pass


class PDFReportVisitor(ReportVisitor):
    """PDF 리포트 생성"""
    
    def visit(self, report: ReportData) -> bytes:
        from reportlab.lib.pagesizes import A4
        from reportlab.pdfgen import canvas
        
        buffer = BytesIO()
        c = canvas.Canvas(buffer, pagesize=A4)
        c.drawString(100, 800, f"Report: {report.title}")
        # ... PDF 생성 로직
        c.save()
        return buffer.getvalue()


class ExcelReportVisitor(ReportVisitor):
    """Excel 리포트 생성"""
    
    def visit(self, report: ReportData) -> bytes:
        buffer = BytesIO()
        with pd.ExcelWriter(buffer, engine='openpyxl') as writer:
            report.chart_data.to_excel(writer, sheet_name='Data')
            pd.DataFrame([report.data]).to_excel(writer, sheet_name='Summary')
        return buffer.getvalue()


class JSONReportVisitor(ReportVisitor):
    """JSON 리포트 생성"""
    
    def visit(self, report: ReportData) -> str:
        return json.dumps({
            'title': report.title,
            'summary': report.data,
            'records': report.chart_data.to_dict(orient='records')
        }, ensure_ascii=False, default=str)


# views.py
class ReportExportView(APIView):
    """리포트 내보내기 API"""
    
    def get(self, request, challenge_id: str):
        format_type = request.query_params.get('format', 'json')
        
        # 리포트 데이터 조회
        report_data = self._build_report(challenge_id)
        
        # Visitor 선택
        visitors = {
            'pdf': PDFReportVisitor(),
            'excel': ExcelReportVisitor(),
            'json': JSONReportVisitor(),
        }
        
        visitor = visitors.get(format_type)
        if not visitor:
            return Response({'error': 'Unsupported format'}, status=400)
        
        result = report_data.accept(visitor)
        
        # 응답 반환
        if format_type == 'json':
            return Response(json.loads(result))
        else:
            content_types = {'pdf': 'application/pdf', 'excel': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}
            return HttpResponse(result, content_type=content_types[format_type])
```

**적용 범위**: 리포트 생성 (PDF/Excel/JSON), 데이터 내보내기, 로그 포맷팅

---

## Factory Pattern (ES 쿼리 빌더)

<!-- 객체 생성 로직 캡슐화 - ES 쿼리, 분석 전략 -->

```python
# factory/es_query_factory.py
from abc import ABC, abstractmethod
from typing import Dict, Any, List


class ESQueryBuilder(ABC):
    """Elasticsearch 쿼리 빌더 인터페이스"""
    
    @abstractmethod
    def build(self, params: Dict[str, Any]) -> Dict[str, Any]:
        pass


class ChallengeSearchBuilder(ESQueryBuilder):
    """챌린지 검색 쿼리 빌더"""
    
    def build(self, params: Dict[str, Any]) -> Dict[str, Any]:
        query = params.get('query', '')
        category = params.get('category')
        
        must_clauses = [
            {'multi_match': {'query': query, 'fields': ['title^3', 'description'], 'analyzer': 'korean'}}
        ]
        
        filter_clauses = [{'term': {'status': 'ACTIVE'}}]
        if category:
            filter_clauses.append({'term': {'category': category}})
        
        return {
            'query': {
                'bool': {
                    'must': must_clauses,
                    'filter': filter_clauses
                }
            },
            'size': params.get('size', 20),
            'from': params.get('offset', 0)
        }


class UserSearchBuilder(ESQueryBuilder):
    """사용자 검색 쿼리 빌더"""
    
    def build(self, params: Dict[str, Any]) -> Dict[str, Any]:
        query = params.get('query', '')
        
        return {
            'query': {
                'bool': {
                    'should': [
                        {'match': {'nickname': {'query': query, 'boost': 2}}},
                        {'match': {'email': query}}
                    ],
                    'minimum_should_match': 1
                }
            },
            'size': params.get('size', 10)
        }


class RecommendationBuilder(ESQueryBuilder):
    """추천 쿼리 빌더 (More Like This)"""
    
    def build(self, params: Dict[str, Any]) -> Dict[str, Any]:
        challenge_id = params.get('challenge_id')
        
        return {
            'query': {
                'more_like_this': {
                    'fields': ['title', 'description', 'category'],
                    'like': [{'_index': 'challenges', '_id': challenge_id}],
                    'min_term_freq': 1,
                    'min_doc_freq': 1
                }
            },
            'size': params.get('size', 5)
        }


class ESQueryFactory:
    """ES 쿼리 빌더 Factory"""
    
    _builders: Dict[str, ESQueryBuilder] = {
        'challenge': ChallengeSearchBuilder(),
        'user': UserSearchBuilder(),
        'recommendation': RecommendationBuilder(),
    }
    
    @classmethod
    def create(cls, query_type: str) -> ESQueryBuilder:
        builder = cls._builders.get(query_type)
        if not builder:
            raise ValueError(f"Unknown query type: {query_type}")
        return builder
    
    @classmethod
    def register(cls, query_type: str, builder: ESQueryBuilder):
        cls._builders[query_type] = builder


# 사용 예시
# views.py
class SearchView(APIView):
    def get(self, request):
        search_type = request.query_params.get('type', 'challenge')
        
        builder = ESQueryFactory.create(search_type)
        query = builder.build(dict(request.query_params))
        
        result = es.search(index=f'{search_type}s', body=query)
        return Response(result['hits'])
```

**적용 범위**: ES 쿼리 빌더, 분석 전략 생성, 추천 엔진 전략

---

## Django Critical Rules

> ⚠️ **READ-ONLY 제약**: Django는 Oracle Core 테이블에 직접 쓰기(INSERT/UPDATE/DELETE)를 수행할 수 없습니다.
> 모든 데이터 변경은 Spring Boot API를 통해 수행해야 합니다.

### 허용 범위
- ✅ Spring Boot로부터 데이터 수신 (Webhook/Sync)
- ✅ Elasticsearch 검색 및 인덱싱
- ✅ 통계 분석 및 추천 알고리즘 계산
- ✅ Django 로컬 DB (sync_*) 쓰기
