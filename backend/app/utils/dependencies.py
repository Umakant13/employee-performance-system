from typing import Optional
from fastapi import Query

class PaginationParams:
    def __init__(
        self,
        skip: int = Query(0, ge=0),
        limit: int = Query(100, ge=1, le=10000)
    ):
        self.skip = skip
        self.limit = limit

class FilterParams:
    def __init__(
        self,
        department: Optional[str] = Query(None),
        is_active: Optional[bool] = Query(None),
        search: Optional[str] = Query(None)
    ):
        self.department = department
        self.is_active = is_active
        self.search = search