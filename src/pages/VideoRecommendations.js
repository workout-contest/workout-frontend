import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import storageManager from '../utils/storageManager';
import apiService from '../services/apiService';

const VideoContainer = styled.div`
  min-height: 100vh;
  background: var(--bg-secondary);
  padding: var(--spacing-lg);
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }
`;

const Header = styled.div`
  background: var(--primary-gradient);
  border-radius: var(--radius-xl);
  padding: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  color: white;
  text-align: center;
`;

const Title = styled.h1`
  font-family: var(--font-primary);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
`;

const Subtitle = styled.p`
  font-family: var(--font-primary);
  font-size: 1rem;
  opacity: 0.9;
`;

const FilterSection = styled.div`
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
`;

const FilterTitle = styled.h3`
  font-family: var(--font-primary);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
`;

const FilterButtons = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
`;

const FilterButton = styled.button`
  font-family: var(--font-primary);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-md);
  background: ${props =>
    props.active ? 'var(--primary-gradient)' : 'var(--bg-primary)'};
  color: ${props => (props.active ? 'white' : 'var(--text-secondary)')};
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--primary-color);
    transform: translateY(-1px);
  }
`;

const VideoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-lg);
`;

const VideoCard = styled.div`
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
  }
`;

const VideoThumbnail = styled.div`
  width: 100%;
  height: 200px;
  background: var(--primary-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: white;
  position: relative;
  cursor: pointer;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlayButton = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: var(--primary-color);
`;

const VideoInfo = styled.div`
  padding: var(--spacing-lg);
`;

const VideoTitle = styled.h4`
  font-family: var(--font-primary);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
`;

const VideoDescription = styled.p`
  font-family: var(--font-primary);
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.5;
  margin-bottom: var(--spacing-md);
`;

const VideoMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: var(--text-light);
`;

const Duration = styled.span`
  background: var(--bg-tertiary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
`;

const Difficulty = styled.span`
  background: ${props => {
    switch (props.level) {
      case '초급':
        return 'rgba(34, 197, 94, 0.1)';
      case '중급':
        return 'rgba(251, 191, 36, 0.1)';
      case '고급':
        return 'rgba(239, 68, 68, 0.1)';
      default:
        return 'var(--bg-tertiary)';
    }
  }};
  color: ${props => {
    switch (props.level) {
      case '초급':
        return '#22c55e';
      case '중급':
        return '#fbbf24';
      case '고급':
        return '#ef4444';
      default:
        return 'var(--text-muted)';
    }
  }};
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-weight: 500;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-muted);
  font-size: 1.1rem;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--error-color);
  font-size: 1.1rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: var(--radius-md);
  margin: var(--spacing-lg);
`;

const EmptyMessage = styled.div`
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-muted);
  font-size: 1.1rem;
  grid-column: 1 / -1;
`;

const CategoryTag = styled.span`
  background: var(--bg-tertiary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: var(--spacing-xs);
  display: inline-block;
`;

const VideoRecommendations = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({});

  // YouTube URL에서 video ID 추출
  const extractVideoId = url => {
    if (!url) return null;
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // YouTube 썸네일 URL 생성
  const getThumbnailUrl = videoId => {
    if (!videoId) return null;
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  // 카테고리별 동영상 가져오기
  const fetchVideosByCategory = async categorySmall => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiService.getWorkoutProgram(categorySmall);

      if (response.status === 200 && response.data) {
        const formattedVideos = response.data.map(item => {
          const videoId = extractVideoId(item.video_url);
          return {
            id: item.id,
            programNumber: item.program_number,
            title: item.title,
            videoUrl: item.video_url,
            videoId: videoId,
            thumbnailUrl: getThumbnailUrl(videoId),
            categoryLarge: item.category_large,
            categoryMedium: item.category_medium,
            categorySmall: item.category_small,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
          };
        });
        setVideos(formattedVideos);
      }
    } catch (err) {
      console.error('동영상 로드 오류:', err);
      setError('동영상을 불러오는 중 오류가 발생했습니다.');
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  // 모든 카테고리 목록 가져오기 (초기 로드)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        // 주요 카테고리 목록 정의 (CSV 데이터 기반)
        const categoryList = [
          '집콕운동',
          '다이어트 댄스',
          '근력 및 근지구력',
          '심폐지구력',
          '유연성',
          '순발력',
          '민첩성',
          '협응력',
          '근·골격계',
        ];

        setCategories(categoryList);

        // 첫 번째 카테고리의 동영상 로드
        if (categoryList.length > 0) {
          await fetchVideosByCategory(categoryList[0]);
          setSelectedCategory(categoryList[0]);
        }
      } catch (err) {
        console.error('카테고리 로드 오류:', err);
        setError('카테고리를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();

    const savedUserInfo = storageManager.getUserInfo();
    if (savedUserInfo) {
      setUserInfo(savedUserInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 카테고리 선택 핸들러
  const handleCategorySelect = async category => {
    setSelectedCategory(category);
    await fetchVideosByCategory(category);
  };

  // 동영상 재생 핸들러
  const handleVideoPlay = video => {
    if (video.videoUrl) {
      window.open(video.videoUrl, '_blank');
    }
  };

  const getRecommendationMessage = () => {
    if (userInfo.bmi < 18.5) return '체중 증가를 위한 근력 운동을 추천합니다.';
    if (userInfo.bmi < 23)
      return '건강 유지를 위한 균형 잡힌 운동을 추천합니다.';
    if (userInfo.bmi < 25)
      return '체중 관리에 효과적인 유산소 운동을 추천합니다.';
    if (userInfo.bmi < 30) return '체중 감량을 위한 고강도 운동을 추천합니다.';
    return '전문가와 상담 후 체계적인 운동을 시작하세요.';
  };

  return (
    <VideoContainer>
      <Header>
        <Title>🎥 맞춤 동영상 추천</Title>
        <Subtitle>
          운동 카테고리별로 검색하여 원하는 운동 동영상을 시청하세요
        </Subtitle>
      </Header>

      <FilterSection>
        <FilterTitle>운동 카테고리 (category_small)</FilterTitle>
        <FilterButtons>
          {categories.map(category => (
            <FilterButton
              key={category}
              active={selectedCategory === category}
              onClick={() => handleCategorySelect(category)}
            >
              {category}
            </FilterButton>
          ))}
        </FilterButtons>
      </FilterSection>

      {loading && <LoadingMessage>동영상을 불러오는 중...</LoadingMessage>}

      {error && <ErrorMessage>{error}</ErrorMessage>}

      {!loading && !error && (
        <VideoGrid>
          {videos.length === 0 ? (
            <EmptyMessage>해당 카테고리의 동영상이 없습니다.</EmptyMessage>
          ) : (
            videos.map(video => (
              <VideoCard key={video.id}>
                <VideoThumbnail onClick={() => handleVideoPlay(video)}>
                  {video.thumbnailUrl ? (
                    <img src={video.thumbnailUrl} alt={video.title} />
                  ) : (
                    <span>🎥</span>
                  )}
                  <PlayButton>▶</PlayButton>
                </VideoThumbnail>
                <VideoInfo>
                  <VideoTitle>{video.title}</VideoTitle>
                  <VideoMeta>
                    <CategoryTag>{video.categorySmall}</CategoryTag>
                  </VideoMeta>
                  {video.categoryMedium && (
                    <VideoDescription>
                      {video.categoryLarge} · {video.categoryMedium}
                    </VideoDescription>
                  )}
                </VideoInfo>
              </VideoCard>
            ))
          )}
        </VideoGrid>
      )}
    </VideoContainer>
  );
};

export default VideoRecommendations;
