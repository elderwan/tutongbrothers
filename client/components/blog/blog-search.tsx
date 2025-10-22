"use client"

import { useState, useEffect } from "react"
import { Search, Filter, SortAsc, SortDesc, Calendar, Heart, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { getBlogTypes } from "@/api/blog"

interface BlogSearchProps {
  onSearch: (params: SearchParams) => void
  initialParams?: SearchParams
}

export interface SearchParams {
  search?: string
  type?: string
  sortBy?: string
}

export default function BlogSearch({ onSearch, initialParams }: BlogSearchProps) {
  const [searchText, setSearchText] = useState(initialParams?.search || "")
  const [selectedType, setSelectedType] = useState(initialParams?.type || "all")
  const [sortBy, setSortBy] = useState(initialParams?.sortBy || "latest")
  const [blogTypes, setBlogTypes] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // 获取博客类型列表
  useEffect(() => {
    const fetchBlogTypes = async () => {
      try {
        const res = await getBlogTypes()
        if (res.code == 200) {
          setBlogTypes(res.data)
        }
      } catch (error) {
        console.error("Failed to fetch blog types:", error)
      }
    }
    fetchBlogTypes()
  }, [])

  // 处理搜索
  const handleSearch = () => {
    const params: SearchParams = {
      search: searchText.trim() || undefined,
      type: selectedType === "all" ? undefined : selectedType,
      sortBy: sortBy
    }
    onSearch(params)
  }

  // 清除所有筛选
  const clearFilters = () => {
    setSearchText("")
    setSelectedType("all")
    setSortBy("latest")
    onSearch({ sortBy: "latest" })
  }

  // 检查是否有活动筛选
  const hasActiveFilters = searchText.trim() !== "" || selectedType !== "all" || sortBy !== "latest"

  // 排序选项
  const sortOptions = [
    { value: "latest", label: "latest", icon: Calendar },
    { value: "oldest", label: "oldest", icon: Calendar },
    { value: "popular", label: "popular", icon: Heart }
  ]

  return (
    <div className="space-y-4">
      {/* 搜索栏 */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} className="px-6">
          search
        </Button>
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="glass rounded-beagle-lg shadow-beagle-lg border border-white/20 w-80 p-4" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">filter options</h4>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-auto p-1 text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    clear
                  </Button>
                )}
              </div>

              {/* 类型筛选 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">blog types</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-cream">
                    <SelectItem value="all">all types</SelectItem>
                    {blogTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 排序选项 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">sort by</label>
                <div className="grid grid-cols-1 gap-2">
                  {sortOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <Button
                        key={option.value}
                        variant={sortBy === option.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSortBy(option.value)}
                        className="justify-start"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {option.label}
                      </Button>
                    )
                  })}
                </div>
              </div>

              <Button onClick={handleSearch} className="w-full">
                apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* 活动筛选标签 */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchText.trim() && (
            <Badge variant="secondary" className="flex items-center gap-1">
              search: {searchText}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSearchText("")
                  handleSearch()
                }}
              />
            </Badge>
          )}
          {selectedType !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              type: {selectedType}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSelectedType("all")
                  handleSearch()
                }}
              />
            </Badge>
          )}
          {sortBy !== "latest" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              排序: {sortOptions.find(opt => opt.value === sortBy)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  setSortBy("latest")
                  handleSearch()
                }}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}