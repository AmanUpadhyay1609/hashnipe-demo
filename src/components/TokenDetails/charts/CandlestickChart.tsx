import React, { useRef, useEffect } from 'react';
import { createChart, ColorType } from 'lightweight-charts';

interface CandlestickChartProps {
  data: {
    dt: string;
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
  }[];
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) return;
    
    // Clear previous chart
    chartContainerRef.current.innerHTML = '';
    
    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'rgba(17, 24, 39, 0)' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
      },
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.3)',
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: 'rgba(197, 203, 206, 0.3)',
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: '#6b7280',
          width: 1,
          style: 3,
          labelBackgroundColor: '#374151',
        },
        horzLine: {
          color: '#6b7280',
          width: 1,
          style: 3,
          labelBackgroundColor: '#374151',
        },
      },
      handleScroll: {
        vertTouchDrag: false,
      },
    });
    
    // Add candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#22c55e', // Green
      downColor: '#ef4444', // Red
      borderVisible: false,
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    });
    
    // Add volume series
    const volumeSeries = chart.addHistogramSeries({
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });
    
    // Add EMA indicators
    const ema20 = chart.addLineSeries({
      color: '#60a5fa', // Blue
      lineWidth: 2,
      title: 'EMA 20',
    });
    
    const ema50 = chart.addLineSeries({
      color: '#c084fc', // Purple
      lineWidth: 2,
      title: 'EMA 50',
    });
    
    // Transform data for the chart
    const transformedCandles = data.map(item => ({
      time: new Date(item.dt).getTime() / 1000,
      open: item.o,
      high: item.h,
      low: item.l,
      close: item.c,
    }));
    
    const volumes = data.map(item => ({
      time: new Date(item.dt).getTime() / 1000,
      value: item.v,
      color: item.c >= item.o ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)',
    }));
    
    // Calculate EMA values (simplified - in reality you'd use a proper algorithm)
    const calculateEMA = (data: any[], period: number) => {
      const k = 2 / (period + 1);
      let ema = data[0].close;
      
      return data.map(candle => {
        ema = candle.close * k + ema * (1 - k);
        return {
          time: candle.time,
          value: ema
        };
      });
    };
    
    const ema20Values = calculateEMA(transformedCandles, 20);
    const ema50Values = calculateEMA(transformedCandles, 50);
    
    // Set the data
    candlestickSeries.setData(transformedCandles);
    volumeSeries.setData(volumes);
    ema20.setData(ema20Values);
    ema50.setData(ema50Values);
    
    // Adjust chart size on window resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Fit content
    chart.timeScale().fitContent();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data]);
  
  return (
    <div className="h-[500px] w-full" ref={chartContainerRef}></div>
  );
};

export default CandlestickChart;